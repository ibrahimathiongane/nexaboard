import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../../common/email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto, userAgent?: string, ipAddress?: string) {
    const user = await this.usersService.create(dto);
    const tokens = await this.generateTokens(user.id, user.email);

    await this.createSession(user.id, tokens.refreshToken, userAgent, ipAddress);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto, userAgent?: string, ipAddress?: string) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await this.usersService.verifyPassword(user, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.createSession(user.id, tokens.refreshToken, userAgent, ipAddress);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const session = await this.prisma.session.findUnique({
        where: { token: refreshToken },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token invalide');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      const tokens = await this.generateTokens(user.id, user.email);

      await this.prisma.session.update({
        where: { id: session.id },
        data: { token: tokens.refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Refresh token invalide');
    }
  }

  async logout(refreshToken: string) {
    await this.prisma.session.deleteMany({
      where: { token: refreshToken },
    });
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findByIdOrThrow(userId);
    return this.sanitizeUser(user);
  }

  async sendVerificationEmail(userId: string) {
    const user = await this.usersService.findByIdOrThrow(userId);
    const token = this.jwtService.sign(
      { sub: userId, type: 'email-verification' },
      { expiresIn: '24h' },
    );

    const verificationUrl = this.emailService.getVerificationUrl(token);

    await this.emailService.send({
      to: user.email,
      subject: 'Vérifiez votre email - nexaBoard',
      html: `
        <h1>Bonjour ${user.firstName} !</h1>
        <p>Merci de vous être inscrit sur nexaBoard.</p>
        <p>Cliquez sur le lien ci-dessous pour vérifier votre email :</p>
        <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background:#3B82F6;color:#fff;text-decoration:none;border-radius:6px;">
          Vérifier mon email
        </a>
        <p>Ce lien expire dans 24 heures.</p>
        <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
      `,
    });
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (payload.type !== 'email-verification') {
        throw new UnauthorizedException('Token invalide');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { emailVerified: true },
      });

      return { message: 'Email vérifié avec succès' };
    } catch {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Ne pas révéler si l'email existe
      return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
    }

    const token = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      { expiresIn: '1h' },
    );

    const resetUrl = this.emailService.getResetPasswordUrl(token);

    await this.emailService.send({
      to: email,
      subject: 'Réinitialisez votre mot de passe - nexaBoard',
      html: `
        <h1>Réinitialisation du mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#3B82F6;color:#fff;text-decoration:none;border-radius:6px;">
          Réinitialiser mon mot de passe
        </a>
        <p>Ce lien expire dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      `,
    });

    return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Token invalide');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      const passwordHash = await this.hashPassword(newPassword);
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { passwordHash },
      });

      // Invalider toutes les sessions existantes
      await this.prisma.session.deleteMany({
        where: { userId: payload.sub },
      });

      return { message: 'Mot de passe réinitialisé avec succès' };
    } catch {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.hash(password, 12);
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async createSession(userId: string, token: string, userAgent?: string, ipAddress?: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return this.prisma.session.create({
      data: {
        userId,
        token,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });
  }

  private sanitizeUser(user: User) {
    const { passwordHash, mfaSecret, ...result } = user;
    return result;
  }
}
