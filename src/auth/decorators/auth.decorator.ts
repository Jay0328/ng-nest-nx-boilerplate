import { UseGuards, applyDecorators, SetMetadata } from '@nestjs/common';
import { AUTH_GURARD_OPTIONS_METADAT_KEY, AuthGuard, AuthGuardOptions } from '../guards/auth.guard';

export const Auth = (options?: AuthGuardOptions) =>
  applyDecorators(SetMetadata(AUTH_GURARD_OPTIONS_METADAT_KEY, options), UseGuards(AuthGuard));
