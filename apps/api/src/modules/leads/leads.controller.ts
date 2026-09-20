import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { SubscribeBetaDto } from './dto/subscribe-beta.dto';
import { LeadsService } from './leads.service';

@Controller('beta')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('subscribe')
  @Throttle({ short: { ttl: 60000, limit: 3 } })
  @HttpCode(HttpStatus.CREATED)
  async subscribe(@Body() dto: SubscribeBetaDto, @Req() request: Request) {
    return this.leadsService.subscribe(dto, request.headers['user-agent'], request.ip);
  }
}
