import { Controller, Param, Get, Post, Put, Delete, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const user = await this.usersService.findOneById(userId);

    if (!user) {
      throw new BadRequestException();
    }

    return user;
  }

  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(userId, updateUserDto);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
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
