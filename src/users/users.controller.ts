import { Controller, Param, Get, Post, Put, Delete, Body, BadRequestException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { UserAlreadyExistedException } from './exceptions/user-already-existed.exception';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserByIdPipe } from './pipes/user-by-id.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() createUserInput: CreateUserInput) {
    try {
      return await this.usersService.create(createUserInput);
    } catch (error) {
      if (error instanceof UserAlreadyExistedException) {
        throw new BadRequestException();
      } else {
        throw error;
      }
    }
  }

  @Get(':userId')
  findOne(@Param('userId', UserByIdPipe) user: UserEntity) {
    return user;
  }

  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() updateUserInput: UpdateUserInput) {
    try {
      return await this.usersService.update(userId, updateUserInput);
    } catch (error) {
      if (error instanceof UserNotFoundException || error instanceof UserAlreadyExistedException) {
        throw new BadRequestException();
      } else {
        throw error;
      }
    }
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    await this.usersService.remove(userId);
  }
}
