import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getRequestFromExecutionContext } from '../common/get-request-from-execution-context';
import { RequestContextService } from '../../request-context/request-context.service';

@Injectable()
export class RequestContextGuard implements CanActivate {
  constructor(private readonly requestContextService: RequestContextService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = getRequestFromExecutionContext(context);
    this.requestContextService.setToRequest(request);
    return true;
  }
}
