import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { SubscribeBetaDto } from './dto/subscribe-beta.dto';
import { LeadsService } from './leads.service';

@Controller('beta')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  async subscribe(@Body() dto: SubscribeBetaDto, @Req() request: Request) {
    return this.leadsService.subscribe(
      dto,
      request.headers['user-agent'],
      request.ip,
    );
  }
}
