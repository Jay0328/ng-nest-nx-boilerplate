import { Inject } from '@nestjs/common';
import { CONFIG_TOKEN } from './config-token.constant';

export function InjectConfig(): ParameterDecorator {
  return Inject(CONFIG_TOKEN);
}
