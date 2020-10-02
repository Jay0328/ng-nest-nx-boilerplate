import { Module, Global, DynamicModule } from '@nestjs/common';
import { CONFIG_TOKEN } from './config-token';
import { Config } from './config.typings';

export interface ConfigModuleRegisterOptions {
  getConfigFile: () => Promise<Config>;
}

@Global()
@Module({
  exports: [CONFIG_TOKEN]
})
export class ConfigModule {
  static register(options: ConfigModuleRegisterOptions): DynamicModule {
    const { getConfigFile } = options;
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useFactory: getConfigFile
        }
      ],
      exports: [CONFIG_TOKEN]
    };
  }
}
