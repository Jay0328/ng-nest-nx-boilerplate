import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectConfig } from '../../config/inject-config.decorator';
import { Config } from '../../config/config.typings';
import { JwtPayload } from '../typings/auth.typings';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectConfig() config: Config) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.accessToken.secret
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
