import { Request } from 'express';
import { AuthPayload } from '@ng-nest-boilerplate/isomorphic/auth/auth-payload.typings';

/**
 * @description
 * The RequestContext holds information relevant to the current request, which may be
 * required at various points of the stack.
 */
export class RequestContext {
  static readonly key = Symbol('__RequestContextKey__');

  static getFromRequest(request: Request): RequestContext {
    return (request as any)[RequestContext.key];
  }

  static setToRequest(request: Request, requestContext: RequestContext): void {
    (request as any)[RequestContext.key] = requestContext;
  }

  private readonly _user?: AuthPayload;

  constructor(options: { user?: AuthPayload }) {
    const { user } = options;
    this._user = user;
  }

  get currentUser(): AuthPayload | undefined {
    return this._user;
  }

  get currentUserId(): string | undefined {
    return this._user?.id;
  }
}
