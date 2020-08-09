import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { RequestWityUser } from '../typings/request-with-user';
import { AuthPayload } from '../typings/auth.typings';
import { AuthService } from '../services/auth.service';

export const AUTH_GURARD_OPTIONS_METADAT_KEY = Symbol('Auth Guard Options');

export interface AuthGuardOptions {
  shouldBeSelfUserIdParam?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.headers.authorization?.replace(/^Bearer /, '');
    let user: AuthPayload | undefined;

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      user = this.authService.verifyAccessToken(accessToken);
      (request as RequestWityUser).user = user;
    } catch {
      throw new UnauthorizedException();
    }

    const options = this.reflector.get<AuthGuardOptions | undefined>(
      AUTH_GURARD_OPTIONS_METADAT_KEY,
      context.getHandler()
    );

    if (options?.shouldBeSelfUserIdParam) {
      const userIdFromParam = request.params[options.shouldBeSelfUserIdParam];

      if (userIdFromParam !== user.id) {
        throw new ForbiddenException();
      }
    }

    return true;
  }
}