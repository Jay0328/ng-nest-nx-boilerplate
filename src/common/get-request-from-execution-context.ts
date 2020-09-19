import { ExecutionContext } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { Request } from 'express';

export function getRequestFromExecutionContext(ctx: ExecutionContext): Request {
  if (ctx.getType<GqlContextType>() === 'graphql') {
    return ctx.getArgByIndex(2).req;
  }

  return ctx.switchToHttp().getRequest<Request>();
}
