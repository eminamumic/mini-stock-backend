import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { User } from 'src/entities/user/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists.');
    }

    if (createUserDto.email) {
      const existingUserByEmail = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUserByEmail) {
        throw new ConflictException('Email already exists.');
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const { password, ...userDataWithoutPassword } = createUserDto;

    const newUser = this.userRepository.create({
      ...userDataWithoutPassword,
      hashedPassword,
      createdAt: new Date(),
      isActive: true,
    });

    return this.userRepository.save(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async searchUsers(searchCriteria: SearchUserDto): Promise<User[]> {
    const whereClause: FindOptionsWhere<User> = {};

    if (searchCriteria.id) {
      whereClause.id = searchCriteria.id;
    }
    if (searchCriteria.username) {
      whereClause.username = Like(`%${searchCriteria.username}%`);
    }
    if (searchCriteria.firstName) {
      whereClause.firstName = Like(`%${searchCriteria.firstName}%`);
    }
    if (searchCriteria.lastName) {
      whereClause.lastName = Like(`%${searchCriteria.lastName}%`);
    }
    if (searchCriteria.email) {
      whereClause.email = Like(`%${searchCriteria.email}%`);
    }
    if (searchCriteria.isActive !== undefined) {
      whereClause.isActive = searchCriteria.isActive;
    }
    if (searchCriteria.userRole) {
      whereClause.userRole = Like(`%${searchCriteria.userRole}%`);
    }

    return this.userRepository.find({
      where: whereClause,
    });
  }
}
