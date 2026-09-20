import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../../common/email/email.service';

interface DripEmail {
  delayDays: number;
  subject: string;
  html: (position: number, referralCode: string | null) => string;
}

const DRIP_EMAILS: DripEmail[] = [
  {
    delayDays: 3,
    subject: 'Comment nexaBoard vous fera gagner 2h par semaine',
    html: (position, _referralCode) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Les coulisses de nexaBoard</title>
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
        <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 16px; color: #0f172a;">Les coulisses de nexaBoard 🎬</h1>
        <p style="font-size: 15px; line-height: 24px; margin: 0 0 20px; color: #334155;">
          Bonjour,<br><br>
          Vous faites partie des <strong>pionniers #${position}</strong>. Merci pour votre confiance.
        </p>
        <p style="font-size: 15px; line-height: 24px; margin: 0 0 20px; color: #334155;">
          Voici ce que nous avons construit pour vous :
        </p>
        <ul style="font-size: 14px; line-height: 22px; margin: 0 0 24px; padding-left: 20px; color: #475569;">
          <li>Un <strong>tableau Kanban</strong> ultra-réactif avec drag-and-drop</li>
          <li>Un <strong>éditeur Markdown</strong> pour vos notes d'équipe</li>
          <li>Un <strong>calendrier partagé</strong> connecté à vos projets</li>
          <li>Des <strong>espaces de travail isolés</strong> avec gestion des rôles</li>
        </ul>
        <div style="text-align: center; margin: 32px 0 16px;">
          <a href="https://nexaboardapp.up.railway.app/auth/login" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">Découvrir nexaBoard →</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
        nexaBoard — Données hébergées en France. Vos données vous appartiennent.
      </td>
    </tr>
  </table>
</body>
</html>`,
  },
  {
    delayDays: 7,
    subject: '🚀 Vos identifiants pour démarrer sur nexaBoard Bêta',
    html: (_position, referralCode) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activez votre espace nexaBoard</title>
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
        <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 16px; color: #0f172a;">Activez votre espace Bêta 🚀</h1>
        <p style="font-size: 15px; line-height: 24px; margin: 0 0 20px; color: #334155;">
          Bonjour,<br><br>
          Il est temps de passer à l'action ! Votre espace de travail nexaBoard est prêt.
        </p>
        <p style="font-size: 15px; line-height: 24px; margin: 0 0 20px; color: #334155;">
          <strong>3 étapes pour démarrer :</strong>
        </p>
        <ol style="font-size: 14px; line-height: 22px; margin: 0 0 24px; padding-left: 20px; color: #475569;">
          <li>Connectez-vous avec votre email</li>
          <li>Créez votre premier projet</li>
          <li>Invitez vos collaborateurs</li>
        </ol>
        <div style="text-align: center; margin: 32px 0 16px;">
          <a href="https://nexaboardapp.up.railway.app/auth/login" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">Accéder à nexaBoard →</a>
        </div>
        ${referralCode ? `
        <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 16px;">
          Partagez avec vos pairs : <a href="https://nexaboardapp.up.railway.app?ref=${referralCode}" style="color: #4f46e5;">nexaboardapp.up.railway.app?ref=${referralCode}</a>
        </p>` : ''}
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
        nexaBoard — Données hébergées en France. Vos données vous appartiennent.
      </td>
    </tr>
  </table>
</body>
</html>`,
  },
];

@Injectable()
export class DripEmailService {
  private readonly logger = new Logger(DripEmailService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async processDripEmails() {
    const now = new Date();

    for (const drip of DRIP_EMAILS) {
      const cutoff = new Date(now.getTime() - drip.delayDays * 24 * 60 * 60 * 1000);

      const subscribers = await this.prisma.betaSubscriber.findMany({
        where: {
          status: 'pending',
          createdAt: { lte: cutoff },
        },
      });

      for (const sub of subscribers) {
        const alreadySentKey = `drip_${drip.delayDays}d_${sub.id}`;
        const alreadySent = await this.prisma.notification.findFirst({
          where: {
            userId: sub.id,
            title: alreadySentKey,
          },
        }).catch(() => null);

        if (alreadySent) continue;

        await this.emailService.send({
          to: sub.email,
          subject: drip.subject,
          html: drip.html(sub.position, sub.referralCode),
        }).catch((err: Error) => {
          this.logger.warn(`Drip email failed for ${sub.email}: ${err.message}`);
        });

        await this.prisma.notification.create({
          data: {
            userId: sub.id,
            title: alreadySentKey,
            message: `Drip email ${drip.delayDays}d sent`,
            type: 'info',
          },
        }).catch(() => {});
      }
    }
  }
}
