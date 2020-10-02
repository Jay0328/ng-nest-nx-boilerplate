import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  sign(payload: string | object | Buffer, secretOrPublicKey: jwt.Secret, options?: jwt.SignOptions): string {
    return jwt.sign(payload, secretOrPublicKey, options);
  }

  verify<Payload extends object = any>(
    token: string,
    secretOrPublicKey: jwt.Secret,
    options?: jwt.VerifyOptions
  ): Payload {
    return jwt.verify(token, secretOrPublicKey, options) as Payload;
  }
}
