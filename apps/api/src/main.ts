import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';

async function bootstrap() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 1.0,
    });
  }

  const app = await NestFactory.create(AppModule);

  const defaultOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    'https://nexaboardapp.up.railway.app',
  ];

  const envOrigins =
    process.env.ALLOWED_ORIGINS?.split(',')
      .map((origin) => origin.trim().replace(/\/+$/, ''))
      .filter(Boolean) || [];

  const allowedOriginsList = Array.from(new Set([...defaultOrigins, ...envOrigins]));

  app.enableCors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans Origin (ex. curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.trim().replace(/\/+$/, '');

      if (
        allowedOriginsList.includes(normalizedOrigin) ||
        allowedOriginsList.includes('*') ||
        normalizedOrigin.endsWith('.railway.app') ||
        normalizedOrigin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('nexaBoard API')
    .setDescription("API pour l'application de productivité nexaBoard")
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
