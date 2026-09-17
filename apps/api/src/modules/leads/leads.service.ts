import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../../common/email/email.service';
import { SubscribeBetaDto } from './dto/subscribe-beta.dto';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async subscribe(
    dto: SubscribeBetaDto,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const existing = await this.prisma.betaSubscriber.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException({
        success: false,
        error: {
          code: 'ALREADY_SUBSCRIBED',
          message: 'Cet email est déjà inscrit',
        },
      });
    }

    const position = (await this.prisma.betaSubscriber.count()) + 1;
    const subscriber = await this.prisma.betaSubscriber.create({
      data: {
        email: dto.email.toLowerCase(),
        teamSize: dto.teamSize,
        currentTool: dto.currentTool,
        interest: dto.interest,
        position,
        userAgent,
        ipAddress,
      },
    });

    await this.emailService.send({
      to: subscriber.email,
      subject: 'Bienvenue dans la bêta nexaBoard !',
      html: `<p>Merci pour votre inscription à la bêta nexaBoard.</p><p>Vous êtes en position ${subscriber.position}. Nous vous contacterons bientôt.</p>`,
    });

    return {
      success: true,
      message: 'Inscription réussie !',
      data: {
        id: subscriber.id,
        email: subscriber.email,
        position: subscriber.position,
      },
    };
  }
}
