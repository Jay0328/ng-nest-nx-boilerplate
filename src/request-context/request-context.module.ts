import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { RequestContextService } from './request-context.service';

@Module({
  imports: [CoreModule],
  providers: [RequestContextService],
  exports: [RequestContextService]
})
export class RequestContextModule {}
