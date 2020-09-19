import { Request } from 'express';
import { EntityID } from '../orm';
import { AuthPayload } from '../core/auth/auth-payload.typings';

/**
 * @description
 * The RequestContext holds information relevant to the current request, which may be
 * required at various points of the stack.
 */
export class RequestContext {
  static readonly key = '__RequestContextKey__';

  static getFromRequest(request: Request): RequestContext {
    return (request as any)[RequestContext.key];
  }

  static setToRequest(request: Request, requestContext: RequestContext) {
    (request as any)[RequestContext.key] = requestContext;
  }

  private readonly _user?: AuthPayload;

  constructor(options: { user?: AuthPayload }) {
    const { user } = options;
    this._user = user;
  }

  get currentUser() {
    return this._user;
  }

  get currentUserId(): EntityID | undefined {
    return this._user?.id;
  }
}
