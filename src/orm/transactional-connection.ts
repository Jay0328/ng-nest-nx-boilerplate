import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager, getRepository, ObjectType, Repository } from 'typeorm';
import { RequestContext } from '../request-context/request-context';

export const TRANSACTIONAL_MANAGER_KEY = Symbol('__TransactionalManagerKey__');

@Injectable()
export class TransactionalConnection {
  constructor(@InjectConnection() private connection: Connection) {}

  get rawConnection(): Connection {
    return this.connection;
  }

  private getTransactionManager(ctx: RequestContext): EntityManager | undefined {
    return (ctx as any)[TRANSACTIONAL_MANAGER_KEY];
  }

  getRepository<Entity>(entityClass: ObjectType<Entity>): Repository<Entity>;
  getRepository<Entity>(ctx: RequestContext, entityClass: ObjectType<Entity>): Repository<Entity>;
  getRepository<Entity>(
    ctxOrEntityClass: RequestContext | ObjectType<Entity>,
    mayBeEntityClass?: ObjectType<Entity>
  ): Repository<Entity> {
    if (ctxOrEntityClass instanceof RequestContext) {
      const transactionManager = this.getTransactionManager(ctxOrEntityClass);

      if (transactionManager && transactionManager.queryRunner?.isReleased !== true) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return transactionManager.getRepository(mayBeEntityClass!);
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return getRepository(mayBeEntityClass!);
    }

    return getRepository(ctxOrEntityClass);
  }

  async startTransaction(ctx: RequestContext) {
    const transactionManager = this.getTransactionManager(ctx);

    if (transactionManager?.queryRunner?.isTransactionActive === false) {
      await transactionManager.queryRunner.startTransaction();
    }
  }
}
