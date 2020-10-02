import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { TransactionalConnection, TRANSACTIONAL_MANAGER_KEY } from '@ng-nest-boilerplate/server/common/orm';
import { RequestContext } from '@ng-nest-boilerplate/server/common//request-context';
import { getRequestFromExecutionContext } from '../common/get-request-from-execution-context';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private connection: TransactionalConnection) {}

  private async withTransaction<T>(ctx: RequestContext, work: () => T): Promise<T> {
    const queryRunnerExists = !!(ctx as any)[TRANSACTIONAL_MANAGER_KEY];

    if (queryRunnerExists) {
      return work();
    }

    const queryRunner = this.connection.rawConnection.createQueryRunner();
    await queryRunner.startTransaction();
    (ctx as any)[TRANSACTIONAL_MANAGER_KEY] = queryRunner.manager;

    try {
      const result = await work();

      if (queryRunner.isTransactionActive) {
        await queryRunner.commitTransaction();
      }

      return result;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      throw error;
    } finally {
      if (queryRunner?.isReleased === false) {
        await queryRunner.release();
      }
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = getRequestFromExecutionContext(context);
    const ctx = RequestContext.getFromRequest(request);

    if (!ctx) {
      return next.handle();
    }

    return of(this.withTransaction(ctx, () => next.handle().toPromise()));
  }
}
