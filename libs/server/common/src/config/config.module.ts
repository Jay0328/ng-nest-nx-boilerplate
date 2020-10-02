import { Module, Global, DynamicModule } from '@nestjs/common';
import { CONFIG_TOKEN } from './config-token';
import { Config } from './config.typings';

export interface ConfigModuleRegisterOptions {
  getConfigOptions: () => Promise<Config>;
}

@Global()
@Module({
  exports: [CONFIG_TOKEN]
})
export class ConfigModule {
  static register(options: ConfigModuleRegisterOptions): DynamicModule {
    const { getConfigOptions } = options;
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useFactory: getConfigOptions
        }
      ],
      exports: [CONFIG_TOKEN]
    };
  }
}
