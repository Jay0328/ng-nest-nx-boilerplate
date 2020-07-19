import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { pick } from 'lodash';
import { InjectConfig } from '../../config/inject-config.decorator';
import { Config } from '../../config/config.typings';
import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { AuthPayload, JwtPayload } from '../typings/auth.typings';
import { InvalidRefreshTokenException } from '../exceptions/invalid-refresh-token-exception';

function generateAuthPayload<T extends AuthPayload>(data: T): AuthPayload {
  return pick(data, ['id', 'email', 'firstName', 'lastName'] as const);
}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, @InjectConfig() private readonly config: Config) {}

  private isUserPasswordCorrect(user: UserEntity, password: string): boolean {
    return bcrypt.compareSync(password, user.password);
  }

  private signAccessToken(payload: AuthPayload): string {
    return jwt.sign(payload, this.config.jwt.accessToken.secret, {
      expiresIn: this.config.jwt.accessToken.expiredIn,
      encoding: 'utf-8'
    });
  }

  private signRefreshToken(payload: AuthPayload): string {
    return jwt.sign(payload, this.config.jwt.refreshToken.secret, {
      expiresIn: this.config.jwt.refreshToken.expiredIn,
      encoding: 'utf-8'
    });
  }

  private signAuthTokens(user: UserEntity) {
    const payload = generateAuthPayload(user);
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    return {
      accessToken,
      refreshToken
    };
  }

  private verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, this.config.jwt.refreshToken.secret) as JwtPayload;
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, this.config.jwt.accessToken.secret) as JwtPayload;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email, { selectPassword: true });

    if (!user || !this.isUserPasswordCorrect(user, password)) {
      throw new UnauthorizedException();
    }

    user.removePassword();
    return this.signAuthTokens(user);
  }

  refreshToken(refreshToken: string): string {
    try {
      const payload = this.verifyRefreshToken(refreshToken);

      return this.signAccessToken(generateAuthPayload(payload));
    } catch {
      throw new InvalidRefreshTokenException();
    }
  }
}
