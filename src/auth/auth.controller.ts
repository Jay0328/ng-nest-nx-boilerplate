import { Controller, Post, Body, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginInput } from './inputs/login.input';
import { RefreshTokenInput } from './inputs/refresh-token.input';
import { InvalidRefreshTokenException } from './exceptions/invalid-refresh-token-exception';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() { email, password }: LoginInput) {
    return this.authService.login(email, password);
  }

  @Post('refresh')
  refresh(@Body() { refreshToken }: RefreshTokenInput) {
    try {
      const accessToken = this.authService.refreshToken(refreshToken);

      return { accessToken };
    } catch (error) {
      if (error instanceof InvalidRefreshTokenException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
