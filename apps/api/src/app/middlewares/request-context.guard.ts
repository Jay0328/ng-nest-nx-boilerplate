import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestContextService } from '@nnb/server/common/request-context';
import { getRequestFromExecutionContext } from '../common/get-request-from-execution-context';

@Injectable()
export class RequestContextGuard implements CanActivate {
  constructor(private readonly requestContextService: RequestContextService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = getRequestFromExecutionContext(context);
    this.requestContextService.setToRequest(request);
    return true;
  }
}
