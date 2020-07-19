import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from './entities/user.entity';
import { IsUserEmailNotUsedConstraint } from './validators/is-user-email-not-used.constraint';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => AuthModule)],
  providers: [UsersService, IsUserEmailNotUsedConstraint],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
