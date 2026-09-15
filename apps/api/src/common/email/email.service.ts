import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly frontendUrl: string;

  constructor(private configService: ConfigService) {
    this.frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
  }

  async send(options: SendEmailOptions): Promise<void> {
    // En développement, on log l'email dans la console
    // En production, intégrer un vrai provider (Resend, SendGrid, etc.)
    this.logger.log(`📧 Email sent to: ${options.to}`);
    this.logger.log(`   Subject: ${options.subject}`);
    this.logger.log(`   Body: ${options.html}`);
  }

  getVerificationUrl(token: string): string {
    return `${this.frontendUrl}/auth/verify?token=${token}`;
  }

  getResetPasswordUrl(token: string): string {
    return `${this.frontendUrl}/auth/reset-password?token=${token}`;
  }
}
