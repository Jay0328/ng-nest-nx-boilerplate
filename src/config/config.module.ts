import { Module } from '@nestjs/common';
import { CONFIG_TOKEN } from './config-token';
import { ConfigCoreModule } from './config-core.module';

@Module({
  imports: [ConfigCoreModule.register()],
  exports: [ConfigCoreModule]
})
export class ConfigModule {
  static readonly CONFIG_TOKEN = CONFIG_TOKEN;
}
