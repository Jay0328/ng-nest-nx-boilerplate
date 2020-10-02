import { UseGuards, applyDecorators, SetMetadata } from '@nestjs/common';
import { AUTH_GURARD_OPTIONS_METADAT_KEY, AuthGuard, AuthGuardOptions } from '../middlewares/auth.guard';

export function Auth(options?: AuthGuardOptions) {
  return applyDecorators(SetMetadata(AUTH_GURARD_OPTIONS_METADAT_KEY, options), UseGuards(AuthGuard));
}
