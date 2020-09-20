import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { InjectConfig, Config } from '../../config';
import { RequestContext } from '../../request-context/request-context';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthPayload, JwtPayload } from './auth-payload.typings';
import { InvalidRefreshTokenException } from './exceptions/invalid-refresh-token-exception';
import { AuthTokensDto } from './dtos/auth-tokens.dto';

@Injectable()
export class AuthService {
  constructor(@InjectConfig() private readonly config: Config, private readonly usersService: UsersService) {}

  private isUserPasswordCorrect(user: UserEntity, password: string): boolean {
    return bcrypt.compareSync(password, user.password);
  }

  private filterAuthPayload({ id, email, username }: AuthPayload): AuthPayload {
    return { id, email, username };
  }

  private getAuthPayloadFromUser(user: UserEntity) {
    return this.filterAuthPayload(user);
  }

  signAuthToken(user: UserEntity, type: keyof Config['jwt']): string {
    const { secret, expiresIn } = this.config.jwt[type];

    return jwt.sign(this.getAuthPayloadFromUser(user), secret, {
      expiresIn,
      encoding: 'utf-8'
    });
  }

  verifyAuthToken(token: string, type: keyof Config['jwt']): JwtPayload {
    return jwt.verify(token, this.config.jwt[type].secret) as JwtPayload;
  }

  async login(ctx: RequestContext, email: string, password: string): Promise<AuthTokensDto> {
    const user = await this.usersService.findOneForLogin(ctx, email);

    if (!user || !this.isUserPasswordCorrect(user, password)) {
      throw new UnauthorizedException();
    }

    const accessToken = this.signAuthToken(user, 'accessToken');
    const refreshToken = this.signAuthToken(user, 'refreshToken');

    return {
      accessToken,
      refreshToken
    };
  }

  async refreshToken(ctx: RequestContext, refreshToken: string): Promise<string> {
    try {
      const { id } = this.verifyAuthToken(refreshToken, 'refreshToken');
      const user = await this.usersService.findOneOrFail(ctx, id);
      return this.signAuthToken(user, 'accessToken');
    } catch {
      throw new InvalidRefreshTokenException();
    }
  }
}
