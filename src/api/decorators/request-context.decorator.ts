import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequestFromExecutionContext } from '../common/get-request-from-execution-context';
import { RequestContext } from '../../request-context/request-context';

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
