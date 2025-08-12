import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseAccess } from 'src/entities/warehouse-access/warehouse-access';
import { Employee } from 'src/entities/employee/employee';
import { Warehouse } from 'src/entities/warehouse/warehouse';
import { CreateWarehouseAccessDto } from './dto/create-warehouse-access.dto';
import { UpdateWarehouseAccessDto } from './dto/update-warehouse-access.dto';
import { SearchWarehouseAccessDto } from './dto/search-warehouse-access.dto';

@Injectable()
export class WarehouseAccessService {
  constructor(
    @InjectRepository(WarehouseAccess)
    private readonly warehouseAccessRepository: Repository<WarehouseAccess>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(
    createWarehouseAccessDto: CreateWarehouseAccessDto,
  ): Promise<WarehouseAccess> {
    const existingEmployee = await this.employeeRepository.findOne({
      where: { id: createWarehouseAccessDto.employeeId },
    });
    if (!existingEmployee) {
      throw new BadRequestException(
        `Zaposlenik s ID-em ${createWarehouseAccessDto.employeeId} nije pronađen.`,
      );
    }

    const existingWarehouse = await this.warehouseRepository.findOne({
      where: { id: createWarehouseAccessDto.warehouseId },
    });
    if (!existingWarehouse) {
      throw new BadRequestException(
        `Skladište s ID-em ${createWarehouseAccessDto.warehouseId} nije pronađeno.`,
      );
    }

    const existingAccess = await this.warehouseAccessRepository.findOne({
      where: {
        employeeId: createWarehouseAccessDto.employeeId,
        warehouseId: createWarehouseAccessDto.warehouseId,
      },
    });
    if (existingAccess) {
      throw new ConflictException(
        `Pristup za Zaposlenika ID ${createWarehouseAccessDto.employeeId} u Skladištu ID ${createWarehouseAccessDto.warehouseId} već postoji.`,
      );
    }

    const newWarehouseAccess = this.warehouseAccessRepository.create({
      ...createWarehouseAccessDto,
    });

    return this.warehouseAccessRepository.save(newWarehouseAccess);
  }

  async getAllWarehouseAccess(): Promise<WarehouseAccess[]> {
    return this.warehouseAccessRepository.find({
      relations: ['employee', 'warehouse'],
    });
  }

  async getWarehouseAccessById(id: number): Promise<WarehouseAccess | null> {
    return this.warehouseAccessRepository.findOne({
      where: { id },
      relations: ['employee', 'warehouse'],
    });
  }

  async search(
    searchCriteria: SearchWarehouseAccessDto,
  ): Promise<WarehouseAccess[]> {
    const queryBuilder =
      this.warehouseAccessRepository.createQueryBuilder('access');

    queryBuilder.leftJoinAndSelect('access.employee', 'employee');
    queryBuilder.leftJoinAndSelect('access.warehouse', 'warehouse');

    if (searchCriteria.id) {
      queryBuilder.andWhere('access.id = :id', { id: searchCriteria.id });
    }
    if (searchCriteria.employeeId) {
      queryBuilder.andWhere('access.employeeId = :employeeId', {
        employeeId: searchCriteria.employeeId,
      });
    }
    if (searchCriteria.warehouseId) {
      queryBuilder.andWhere('access.warehouseId = :warehouseId', {
        warehouseId: searchCriteria.warehouseId,
      });
    }
    if (searchCriteria.isActive !== undefined) {
      queryBuilder.andWhere('access.isActive = :isActive', {
        isActive: String(searchCriteria.isActive).toLowerCase() === 'true',
      });
    }

    if (searchCriteria.assignmentDate) {
      const date = new Date(searchCriteria.assignmentDate);
      if (!isNaN(date.getTime())) {
        queryBuilder.andWhere('access.assignmentDate >= :assignmentDate', {
          assignmentDate: date.toISOString(),
        });
      }
    }

    if (searchCriteria.revocationDate) {
      queryBuilder.andWhere('access.revocationDate = :revocationDate', {
        revocationDate: new Date(searchCriteria.revocationDate),
      });
    }

    return queryBuilder.getMany();
  }

  async getDistinctEmployeesWithAccess(): Promise<Employee[]> {
    const accesses = await this.warehouseAccessRepository.find({
      relations: ['employee'],
      select: ['employeeId'],
    });

    const uniqueEmployeeIds = new Set<number>();
    accesses.forEach((access) => uniqueEmployeeIds.add(access.employeeId));

    if (uniqueEmployeeIds.size === 0) {
      return [];
    }

    const uniqueEmployees = await this.employeeRepository.findByIds(
      Array.from(uniqueEmployeeIds),
    );

    return uniqueEmployees;
  }

  async getDistinctWarehousesWithAccess(): Promise<Warehouse[]> {
    const accesses = await this.warehouseAccessRepository.find({
      relations: ['warehouse'],
      select: ['warehouseId'],
    });

    const uniqueWarehouseIds = new Set<number>();
    accesses.forEach((access) => uniqueWarehouseIds.add(access.warehouseId));

    if (uniqueWarehouseIds.size === 0) {
      return [];
    }

    const uniqueWarehouses = await this.warehouseRepository.findByIds(
      Array.from(uniqueWarehouseIds),
    );

    return uniqueWarehouses;
  }

  async update(
    id: number,
    updateWarehouseAccessDto: UpdateWarehouseAccessDto,
  ): Promise<WarehouseAccess | null> {
    const warehouseAccessToUpdate =
      await this.warehouseAccessRepository.findOne({
        where: { id },
      });

    if (!warehouseAccessToUpdate) {
      return null;
    }

    if (
      updateWarehouseAccessDto.employeeId !== undefined &&
      updateWarehouseAccessDto.employeeId !== warehouseAccessToUpdate.employeeId
    ) {
      const existingEmployee = await this.employeeRepository.findOne({
        where: { id: updateWarehouseAccessDto.employeeId },
      });
      if (!existingEmployee) {
        throw new BadRequestException(
          `Zaposlenik s ID-em ${updateWarehouseAccessDto.employeeId} nije pronađen.`,
        );
      }
    }

    if (
      updateWarehouseAccessDto.warehouseId !== undefined &&
      updateWarehouseAccessDto.warehouseId !==
        warehouseAccessToUpdate.warehouseId
    ) {
      const existingWarehouse = await this.warehouseRepository.findOne({
        where: { id: updateWarehouseAccessDto.warehouseId },
      });
      if (!existingWarehouse) {
        throw new BadRequestException(
          `Skladište s ID-em ${updateWarehouseAccessDto.warehouseId} nije pronađeno.`,
        );
      }
    }

    if (
      (updateWarehouseAccessDto.employeeId !== undefined &&
        updateWarehouseAccessDto.employeeId !==
          warehouseAccessToUpdate.employeeId) ||
      (updateWarehouseAccessDto.warehouseId !== undefined &&
        updateWarehouseAccessDto.warehouseId !==
          warehouseAccessToUpdate.warehouseId)
    ) {
      const targetEmployeeId =
        updateWarehouseAccessDto.employeeId ||
        warehouseAccessToUpdate.employeeId;
      const targetWarehouseId =
        updateWarehouseAccessDto.warehouseId ||
        warehouseAccessToUpdate.warehouseId;

      const conflictingAccess = await this.warehouseAccessRepository.findOne({
        where: {
          employeeId: targetEmployeeId,
          warehouseId: targetWarehouseId,
        },
      });

      if (conflictingAccess && conflictingAccess.id !== id) {
        throw new ConflictException(
          `Pristup za Zaposlenika ID ${targetEmployeeId} u Skladištu ID ${targetWarehouseId} već postoji.`,
        );
      }
    }

    this.warehouseAccessRepository.merge(warehouseAccessToUpdate, {
      ...updateWarehouseAccessDto,
    });

    return this.warehouseAccessRepository.save(warehouseAccessToUpdate);
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.warehouseAccessRepository.delete(id);
    return deleteResult.affected !== 0;
  }
}
