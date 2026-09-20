import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { DripEmailService } from './drip-email.service';
import { EmailModule } from '../../common/email/email.module';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [EmailModule, PrismaModule],
  controllers: [LeadsController],
  providers: [LeadsService, DripEmailService],
})
export class LeadsModule {}
