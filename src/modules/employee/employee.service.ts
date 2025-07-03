import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Employee } from 'src/entities/employee/employee';
import { User } from 'src/entities/user/user';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { SearchEmployeeDto } from './dto/search-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    if (createEmployeeDto.userId) {
      const existingUser = await this.userRepository.findOne({
        where: { id: createEmployeeDto.userId },
      });
      if (!existingUser) {
        throw new BadRequestException(
          `User with ID ${createEmployeeDto.userId} not found. Cannot associate employee.`,
        );
      }
    }

    const newEmployee = this.employeeRepository.create({
      ...createEmployeeDto,
      isActive: true,
    });

    return this.employeeRepository.save(newEmployee);
  }
}
