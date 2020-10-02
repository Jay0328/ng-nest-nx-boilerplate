import { Module } from '@nestjs/common';
import { JwtModule } from '../jwt/jwt.module';
import { RequestContextService } from './request-context.service';

@Module({
  imports: [JwtModule],
  providers: [RequestContextService],
  exports: [RequestContextService]
})
export class RequestContextModule {}
