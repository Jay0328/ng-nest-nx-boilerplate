import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenService } from '../jwt/access-token.service';
import { RequestContext } from './request-context';

@Injectable()
export class RequestContextService {
  constructor(private readonly accessTokenService: AccessTokenService) {}

  private extractUserFromHeader(request: Request) {
    const accessToken = request.headers.authorization?.replace(/^Bearer /, '');

    if (!accessToken) {
      return;
    }

    try {
      return this.accessTokenService.verify(accessToken);
    } catch {
      return undefined;
    }
  }

  private createFromRequest(request: Request): RequestContext {
    const user = this.extractUserFromHeader(request);
    return new RequestContext({
      user
    });
  }

  getFromRequest(request: Request): RequestContext {
    return RequestContext.getFromRequest(request);
  }

  setToRequest(request: Request): void {
    const requestContext = this.createFromRequest(request);
    RequestContext.setToRequest(request, requestContext);
  }
}
