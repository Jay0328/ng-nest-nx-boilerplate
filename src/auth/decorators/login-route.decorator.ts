import { applyDecorators, UseGuards, Post } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';

export function LoginRoute(path?: string | string[]) {
  return applyDecorators(UseGuards(LocalAuthGuard), Post(path));
}
