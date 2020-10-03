import { Injectable } from '@nestjs/common';
import { AuthPayload, JwtPayload } from '@nnb/isomorphic/auth/auth-payload.typings';
import { Config, InjectConfig } from '../config';
import { JwtService } from './jwt.service';

@Injectable()
export class RefreshTokenService {
  constructor(@InjectConfig() private readonly config: Config, private readonly jwtService: JwtService) {}

  sign(payload: AuthPayload): string {
    const { id, email, username } = payload;
    return this.jwtService.sign({ id, email, username }, this.config.jwt.refreshToken.secret, {
      expiresIn: this.config.jwt.refreshToken.expiresIn,
      encoding: 'utf-8'
    });
  }

  verify(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token, this.config.jwt.refreshToken.secret);
  }
}
