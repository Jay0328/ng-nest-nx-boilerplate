import { Module, DynamicModule, Global } from '@nestjs/common';
import { CONFIG_TOKEN } from './constants/config-token.constant';

export interface ConfigCoreModuleRegisterOptions {
  files?: {
    [env in string]: string;
  };
}

@Global()
@Module({
  exports: [CONFIG_TOKEN]
})
export class ConfigCoreModule {
  static register(options?: ConfigCoreModuleRegisterOptions): DynamicModule {
    return {
      module: ConfigCoreModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useFactory: async () => {
            const path = (process.env.NODE_ENV && options?.files?.[process.env.NODE_ENV || '']) || './config';
            return (await import(path)).config;
          }
        }
      ],
      exports: [CONFIG_TOKEN]
    };
  }
}