import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './guards/current-user.decorator';
import type { CurrentUser as CurrentUserType } from './guards/current-user.decorator';
import type { Request } from 'express';
import type { Response } from 'express';

const REFRESH_COOKIE = 'nexaboard_refresh';
const REFRESH_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle({ short: { ttl: 1000, limit: 1 } })
  @ApiOperation({ summary: 'Créer un nouveau compte' })
  async register(@Body() dto: RegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(
      dto,
      req.headers['user-agent'],
      req.ip,
    );
    this.setRefreshCookie(res, result.refreshToken);
    return this.withoutRefreshToken(result);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 1000, limit: 3 } })
  @ApiOperation({ summary: 'Se connecter' })
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(
      dto,
      req.headers['user-agent'],
      req.ip,
    );
    this.setRefreshCookie(res, result.refreshToken);
    return this.withoutRefreshToken(result);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rafraîchir les tokens' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.getRefreshToken(req);
    const result = await this.authService.refreshTokens(refreshToken);
    this.setRefreshCookie(res, result.refreshToken);
    return this.withoutRefreshToken(result);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Se déconnecter' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.getRefreshToken(req);
    await this.authService.logout(refreshToken);
    res.setHeader('Set-Cookie', this.serializeRefreshCookie('', 0));
    return { message: 'Déconnexion réussie' };
  }

  private getRefreshToken(req: Request): string {
    const token = req.headers.cookie
      ?.split(';')
      .map((part) => part.trim().split('='))
      .find(([name]) => name === REFRESH_COOKIE)?.[1];
    if (!token) {
      throw new UnauthorizedException('Refresh token manquant');
    }
    return decodeURIComponent(token);
  }

  private setRefreshCookie(res: Response, token: string) {
    res.setHeader('Set-Cookie', this.serializeRefreshCookie(token, REFRESH_MAX_AGE_SECONDS));
  }

  private withoutRefreshToken<T extends { refreshToken: string }>(result: T) {
    const { refreshToken: _refreshToken, ...safeResult } = result;
    return safeResult;
  }

  private serializeRefreshCookie(token: string, maxAge: number) {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    return `${REFRESH_COOKIE}=${encodeURIComponent(token)}; Max-Age=${maxAge}; Path=/api/v1/auth; HttpOnly; SameSite=Lax${secure}`;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir le profil utilisateur' })
  async getProfile(@CurrentUser() user: CurrentUserType) {
    return this.authService.getProfile(user.id);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 1000, limit: 3 } })
  @ApiOperation({ summary: 'Vérifier l\'email avec le token' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('send-verification-email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 60000, limit: 1 } })
  @ApiOperation({ summary: 'Renvoyer l\'email de vérification' })
  async sendVerificationEmail(@CurrentUser() user: CurrentUserType) {
    await this.authService.sendVerificationEmail(user.id);
    return { message: 'Email de vérification envoyé' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 60000, limit: 1 } })
  @ApiOperation({ summary: 'Demander un lien de réinitialisation du mot de passe' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 1000, limit: 3 } })
  @ApiOperation({ summary: 'Réinitialiser le mot de passe' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password);
  }
}
