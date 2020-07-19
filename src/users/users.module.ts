import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { IsUserEmailNotUsedConstraint } from './validators/is-user-email-not-used.constraint';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, IsUserEmailNotUsedConstraint],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
