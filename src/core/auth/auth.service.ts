import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { InjectConfig, Config } from '../../config';
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

  sign(user: UserEntity, type: keyof Config['jwt']): string {
    const { secret, expiresIn } = this.config.jwt[type];

    return jwt.sign(this.getAuthPayloadFromUser(user), secret, {
      expiresIn,
      encoding: 'utf-8'
    });
  }

  verify(token: string, type: keyof Config['jwt']): JwtPayload {
    return jwt.verify(token, this.config.jwt[type].secret) as JwtPayload;
  }

  async login(email: string, password: string): Promise<AuthTokensDto> {
    const user = await this.usersService.findOneWithPasswordByEmail(email);

    if (!user || !this.isUserPasswordCorrect(user, password)) {
      throw new UnauthorizedException();
    }

    const accessToken = this.sign(user, 'accessToken');
    const refreshToken = this.sign(user, 'refreshToken');

    return {
      accessToken,
      refreshToken
    };
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const { id } = this.verify(refreshToken, 'refreshToken');
      const user = await this.usersService.findOneOrFail(id);
      return this.sign(user, 'accessToken');
    } catch {
      throw new InvalidRefreshTokenException();
    }
  }
}
