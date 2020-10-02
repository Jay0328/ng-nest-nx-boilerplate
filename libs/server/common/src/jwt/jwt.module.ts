import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { AccessTokenService } from './access-token.service';
import { RefreshTokenService } from './refresh-token.service';

const services = [JwtService, AccessTokenService, RefreshTokenService];

@Module({
  providers: [...services],
  exports: [...services]
})
export class JwtModule {}
