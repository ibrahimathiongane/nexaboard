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
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  }

  async send(options: SendEmailOptions): Promise<void> {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.configService.get<string>('RESEND_FROM', 'nexaBoard <onboarding@resend.dev>'),
          ...options,
        }),
      });
      if (!response.ok) {
        const errorDetails = await response.text().catch(() => '');
        this.logger.error(`Resend email failed [${response.status}]: ${errorDetails}`);
        throw new Error(`Resend email failed with status ${response.status}: ${errorDetails}`);
      }
      return;
    }

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
