import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InvalidRefreshTokenException } from '../../core/auth/exceptions/invalid-refresh-token-exception';
import { AuthService } from '../../core/auth/auth.service';
import { AuthTokens } from './dtos/auth-tokens.type';
import { LoginArgs } from './dtos/login.args';
import { RefreshTokenArgs } from './dtos/refresh-token.args';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthTokens)
  async login(@Args() loginArgs: LoginArgs): Promise<AuthTokens> {
    const { email, password } = loginArgs;
    return await this.authService.login(email, password);
  }

  @Mutation(() => String)
  refreshToken(@Args() { refreshToken }: RefreshTokenArgs): Promise<string> {
    try {
      const accessToken = this.authService.refreshToken(refreshToken);
      return accessToken;
    } catch (error) {
      if (error instanceof InvalidRefreshTokenException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
