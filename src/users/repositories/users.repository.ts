import { EntityRepository } from 'typeorm';
import { Repository } from '../../shared/typeorm';
import { UserEntity } from '../entities/user.entity';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {}
