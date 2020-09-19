import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { getRequestFromExecutionContext } from '../../common/get-request-from-execution-context';
import { RequestContextService } from '../../request-context/request-context.service';

export const AUTH_GURARD_OPTIONS_METADAT_KEY = Symbol('Auth Guard Options');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AuthGuardOptions {}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly requestContextService: RequestContextService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequestFromExecutionContext(context);
    const requestContext = this.requestContextService.getFromRequest(request);
    const { currentUser } = requestContext;

    if (!currentUser) {
      throw new UnauthorizedException();
    }

    const options = this.reflector.get<AuthGuardOptions | undefined>(
      AUTH_GURARD_OPTIONS_METADAT_KEY,
      context.getHandler()
    );
    /**
     * @description
     * preserved.
     */
    options;

    return true;
  }
}
