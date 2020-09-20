import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { RequestContext } from '../../request-context/request-context';
import { InvalidRefreshTokenException } from '../../core/auth/exceptions/invalid-refresh-token-exception';
import { AuthService } from '../../core/auth/auth.service';
import { Ctx } from '../decorators/request-context.decorator';
import { AuthTokens } from './dtos/auth-tokens.type';
import { LoginArgs } from './dtos/login.args';
import { RefreshTokenArgs } from './dtos/refresh-token.args';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthTokens)
  async login(@Ctx() ctx: RequestContext, @Args() loginArgs: LoginArgs): Promise<AuthTokens> {
    const { email, password } = loginArgs;
    return await this.authService.login(ctx, email, password);
  }

  @Mutation(() => String)
  refreshToken(@Ctx() ctx: RequestContext, @Args() { refreshToken }: RefreshTokenArgs): Promise<string> {
    try {
      const accessToken = this.authService.refreshToken(ctx, refreshToken);
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
