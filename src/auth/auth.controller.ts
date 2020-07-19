import { Controller, Request, Post, Body, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginRoute } from './decorators/login-route.decorator';
import { RefreshTokenInput } from './inputs/refresh-token.input';
import { InvalidRefreshTokenException } from './exceptions/invalid-refresh-token-exception';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @LoginRoute('login')
  login(@Request() req) {
    return this.authService.signAuthTokens(req.user);
  }

  @Post('refresh')
  refresh(@Body() { refreshToken }: RefreshTokenInput) {
    try {
      const accessToken = this.authService.resignAccessTokenFromRefreshToken(refreshToken);

      return { accessToken };
    } catch (error) {
      if (error instanceof InvalidRefreshTokenException) {
        throw new BadRequestException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
