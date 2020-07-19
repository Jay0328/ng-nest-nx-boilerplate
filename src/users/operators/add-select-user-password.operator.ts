import { TypeOrmQueryBuilderPipeOperator } from '../../shared/typeorm';
import { UserEntity } from '../entities/user.entity';

export function addSelectUserPassword(alias: string): TypeOrmQueryBuilderPipeOperator<UserEntity> {
  return qb => qb.addSelect(`${alias}.password`);
}
