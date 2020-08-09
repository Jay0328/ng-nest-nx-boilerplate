import { ObjectLiteral, Repository as _Repository } from 'typeorm';
import { withPipe, PipeableSelectQueryBuilder } from './pipeable-query-builder';

export class Repository<Entity extends ObjectLiteral> extends _Repository<Entity> {
  createQueryBuilder(
    ...params: Parameters<_Repository<Entity>['createQueryBuilder']>
  ): PipeableSelectQueryBuilder<Entity> {
    return withPipe(super.createQueryBuilder(...params));
  }
}
