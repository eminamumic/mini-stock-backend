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

  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async getEmployeeById(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOne({ where: { id } });
  }

  async search(searchCriteria: SearchEmployeeDto): Promise<Employee[]> {
    const whereClause: FindOptionsWhere<Employee> = {};

    if (searchCriteria.id) {
      whereClause.id = parseInt(searchCriteria.id, 10);
    }
    if (searchCriteria.userId) {
      whereClause.userId = parseInt(searchCriteria.userId, 10);
    }
    if (searchCriteria.firstName) {
      whereClause.firstName = Like(`%${searchCriteria.firstName}%`);
    }
    if (searchCriteria.lastName) {
      whereClause.lastName = Like(`%${searchCriteria.lastName}%`);
    }
    if (searchCriteria.position) {
      whereClause.position = Like(`%${searchCriteria.position}%`);
    }
    if (searchCriteria.employmentDate) {
      whereClause.employmentDate = new Date(searchCriteria.employmentDate);
    }
    if (searchCriteria.contactPhone) {
      whereClause.contactPhone = Like(`%${searchCriteria.contactPhone}%`);
    }
    if (searchCriteria.isActive !== undefined) {
      whereClause.isActive =
        String(searchCriteria.isActive).toLowerCase() === 'true';
    }

    return this.employeeRepository.find({
      where: whereClause,
    });
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee | null> {
    const employeeToUpdate = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!employeeToUpdate) {
      return null;
    }

    if (
      updateEmployeeDto.userId !== undefined &&
      updateEmployeeDto.userId !== null &&
      updateEmployeeDto.userId !== employeeToUpdate.userId
    ) {
      const existingUser = await this.userRepository.findOne({
        where: { id: updateEmployeeDto.userId },
      });
      if (!existingUser) {
        throw new BadRequestException(
          `User with ID ${updateEmployeeDto.userId} not found. Cannot associate employee.`,
        );
      }
    }

    this.employeeRepository.merge(employeeToUpdate, {
      ...updateEmployeeDto,
    });

    return this.employeeRepository.save(employeeToUpdate);
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.employeeRepository.delete(id);
    return deleteResult.affected !== 0;
  }
}
