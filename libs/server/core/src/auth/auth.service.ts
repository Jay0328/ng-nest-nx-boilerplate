import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InvalidRefreshTokenException } from '@nnb/isomorphic/auth/exceptions/invalid-refresh-token.exception';
import { AccessTokenService, RefreshTokenService } from '@nnb/server/common/jwt';
import { RequestContext } from '@nnb/server/common/request-context';
import { UserEntity, UsersService } from '../users';
import { AuthTokensDto } from './dtos/auth-tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly usersService: UsersService
  ) {}

  private isUserPasswordCorrect(user: UserEntity, password: string): boolean {
    return bcrypt.compareSync(password, user.password);
  }

  async login(ctx: RequestContext, email: string, password: string): Promise<AuthTokensDto> {
    const user = await this.usersService.findOneForLogin(ctx, email);

    if (!user || !this.isUserPasswordCorrect(user, password)) {
      throw new UnauthorizedException();
    }

    const accessToken = this.accessTokenService.sign(user);
    const refreshToken = this.refreshTokenService.sign(user);

    return {
      accessToken,
      refreshToken
    };
  }

  async refreshToken(ctx: RequestContext, refreshToken: string): Promise<string> {
    try {
      const { id } = this.refreshTokenService.verify(refreshToken);
      const user = await this.usersService.findOneOrFail(ctx, id);
      return this.accessTokenService.sign(user);
    } catch {
      throw new InvalidRefreshTokenException();
    }
  }
}
