import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWityUser } from '../typings/request-with-user';
import { Request } from 'express';

export const User = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request: Request | RequestWityUser = ctx.switchToHttp().getRequest();

  if ('user' in request) {
    return request.user;
  }

  throw new Error(`Please apply Auth decorator on the method.`);
});
