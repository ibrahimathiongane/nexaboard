import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('leads')
export class LeadsController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createLead(@Body() body: { email: string; workspace?: string }) {
    // For MVP we log leads server-side. Later: persist to DB or forward to CRM.
    console.log('[leads] New lead:', body);
    return { message: 'Lead reçu' };
  }
}
