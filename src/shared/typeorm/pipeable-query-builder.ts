import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export type TypeOrmQueryBuilderPipeOperator<Entity extends ObjectLiteral> = <
  QB extends PipeableSelectQueryBuilder<Entity>
>(
  qb: QB
) => QB;

export type NullableTypeOrmQueryBuilderPipeOperator<Entity extends ObjectLiteral> =
  | TypeOrmQueryBuilderPipeOperator<Entity>
  | false
  | null
  | undefined
  | number;

export interface PipeableSelectQueryBuilder<Entity extends ObjectLiteral> extends SelectQueryBuilder<Entity> {
  pipe(...operators: NullableTypeOrmQueryBuilderPipeOperator<Entity>[]): PipeableSelectQueryBuilder<Entity>;
}

export function withPipe<Entity extends ObjectLiteral>(
  qb: SelectQueryBuilder<Entity>
): PipeableSelectQueryBuilder<Entity> {
  const pipeableQB = qb as PipeableSelectQueryBuilder<Entity>;

  pipeableQB.pipe = (...operators: NullableTypeOrmQueryBuilderPipeOperator<Entity>[]) => {
    if (operators.length) {
      operators.forEach(operator => {
        if (typeof operator === 'function') {
          operator(pipeableQB);
        }
      });
    }

    return pipeableQB;
  };

  return pipeableQB;
}
