import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ConflictException,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { User } from 'src/entities/user/user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  @Get('username/:username')
  @HttpCode(HttpStatus.OK)
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new NotFoundException(
        `User with username '${username}' not found.`,
      );
    }
    return user;
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(@Query() searchCriteria: SearchUserDto): Promise<User[]> {
    return this.userService.search(searchCriteria);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const updatedUser = await this.userService.update(id, updateUserDto);
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleted = await this.userService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }
}
