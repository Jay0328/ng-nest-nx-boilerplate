import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { withPipe } from 'src/shared/typeorm';

export type FindUserBy = { id: string } | { email: string };

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  createFindOneBaseQueryBuilder(alias: string, by: FindUserBy) {
    const key = 'id' in by ? 'id' : 'email';
    return withPipe(this.createQueryBuilder(alias)).pipe(qb => qb.where(`${qb.alias}.${key} = :${key}`, by));
  }
}
