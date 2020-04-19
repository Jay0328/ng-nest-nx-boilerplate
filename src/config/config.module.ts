import { Module } from '@nestjs/common';
import { ConfigCoreModule } from './config-core.module';

@Module({
  imports: [ConfigCoreModule.register()],
  exports: [ConfigCoreModule]
})
export class ConfigModule {}
