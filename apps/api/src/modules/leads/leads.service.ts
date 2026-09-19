import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../../common/email/email.service';
import { SubscribeBetaDto } from './dto/subscribe-beta.dto';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async subscribe(dto: SubscribeBetaDto, userAgent?: string, ipAddress?: string) {
    const existing = await this.prisma.betaSubscriber.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException({
        success: false,
        error: {
          code: 'ALREADY_SUBSCRIBED',
          message: 'Cet email est déjà inscrit dans la cohorte bêta.',
          position: existing.position,
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

    const referralCode = `BETA-${subscriber.position}X${subscriber.id.slice(-4).toUpperCase()}`;
    const referralLink = `https://nexaboardapp.up.railway.app?ref=${referralCode}`;

    this.emailService
      .send({
        to: subscriber.email,
        subject: `🎉 Confirmation de votre place Bêta nexaBoard (#${subscriber.position})`,
        html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue dans la Bêta nexaBoard</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 32px 16px; color: #1e293b;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <tr>
      <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f1f5f9;">
        <span style="font-size: 24px; font-weight: 800; color: #4f46e5; letter-spacing: -0.5px;">nexaBoard</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 16px; color: #0f172a;">Bienvenue dans la cohorte pionnière ! 🎉</h1>
        <p style="font-size: 15px; line-height: 24px; margin: 0 0 20px; color: #334155;">
          Bonjour,<br><br>
          Merci d'avoir rejoint nexaBoard. Votre inscription pour votre équipe a bien été enregistrée.
        </p>
        
        <div style="background-color: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 16px 20px; text-align: center; margin: 24px 0;">
          <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; color: #4338ca; margin: 0 0 4px;">Votre position dans la file d'attente</p>
          <p style="font-size: 32px; font-weight: 800; color: #312e81; margin: 0;">#${subscriber.position}</p>
        </div>

        <p style="font-size: 15px; line-height: 24px; margin: 0 0 20px; color: #334155;">
          <strong>Ce que vous avez débloqué :</strong>
        </p>
        <ul style="font-size: 14px; line-height: 22px; margin: 0 0 24px; padding-left: 20px; color: #475569;">
          <li>Accès prioritaire à la plateforme tout-en-un.</li>
          <li>1 an de Plan Pro offert lors du lancement officiel.</li>
          <li>Accès direct à l'équipe de développement pour co-construire les fonctionnalités.</li>
        </ul>

        <div style="text-align: center; margin: 32px 0 16px;">
          <a href="${referralLink}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">Remonter dans la file (Partager à un pair) →</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
        nexaBoard — Données hébergées en France. Vos données vous appartiennent.<br>
        Vous recevez cet email suite à votre demande sur nexaboardapp.up.railway.app.
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      })
      .catch((err: Error) => {
        this.logger.warn(`Beta confirmation email not sent to ${subscriber.email}: ${err.message}`);
      });

    return {
      success: true,
      message: 'Inscription réussie à la cohorte Bêta !',
      data: {
        id: subscriber.id,
        email: subscriber.email,
        position: subscriber.position,
        referralCode,
        referralLink,
      },
    };
  }
}
