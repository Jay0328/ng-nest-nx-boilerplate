import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestContext } from '@ng-nest-boilerplate/server/common/request-context';
import { getRequestFromExecutionContext } from '../common/get-request-from-execution-context';

/**
 * @description
 * Resolver param decorator which extracts the {@link RequestContext} from the incoming
 * request object.
 *
 * @example
 * ```TypeScript
 *  \@Query()
 *  getAdministrators(\@Ctx() ctx: RequestContext) {
 *      // ...
 *  }
 * ```
 */
export const Ctx = createParamDecorator((_, ctx: ExecutionContext) =>
  RequestContext.getFromRequest(getRequestFromExecutionContext(ctx))
);
