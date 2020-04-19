import { Inject } from '@nestjs/common';
import { CONFIG_TOKEN } from '../constants/config-token.constant';

export function InjectConfig() {
  return Inject(CONFIG_TOKEN);
}
