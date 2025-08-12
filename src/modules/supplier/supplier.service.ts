import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Supplier } from 'src/entities/supplier/supplier';
import { Location } from 'src/entities/location/location';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SearchSupplierDto } from './dto/search-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const existingSupplierByName = await this.supplierRepository.findOne({
      where: { supplierName: createSupplierDto.supplierName },
    });
    if (existingSupplierByName) {
      throw new ConflictException(
        `Dobavljač s imenom '${createSupplierDto.supplierName}' već postoji.`,
      );
    }

    if (createSupplierDto.locationId) {
      const existingLocation = await this.locationRepository.findOne({
        where: { id: createSupplierDto.locationId },
      });
      if (!existingLocation) {
        throw new BadRequestException(
          `Lokacija s ID-em ${createSupplierDto.locationId} nije pronađena.`,
        );
      }
    }

    const newSupplier = this.supplierRepository.create({
      ...createSupplierDto,
    });

    return this.supplierRepository.save(newSupplier);
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return this.supplierRepository.find({ relations: ['location'] });
  }

  async getSupplierById(id: number): Promise<Supplier | null> {
    return this.supplierRepository.findOne({
      where: { id },
      relations: ['location'],
    });
  }

  async getDistinctLocations(): Promise<Location[]> {
    const suppliers = await this.supplierRepository.find({
      relations: ['location'],
    });
    const uniqueLocations = new Set(
      suppliers.map((supplier) => supplier.location),
    );
    return Array.from(uniqueLocations).filter((loc) => loc !== null);
  }

  async getDistinctActiveStatuses(): Promise<boolean[]> {
    const suppliers = await this.supplierRepository.find({
      select: ['isActive'],
    });
    const statuses = new Set(suppliers.map((supplier) => supplier.isActive));
    return Array.from(statuses);
  }

  async search(searchCriteria: SearchSupplierDto): Promise<Supplier[]> {
    const whereClause: FindOptionsWhere<Supplier> = {};

    if (searchCriteria.id) {
      whereClause.id = parseInt(searchCriteria.id, 10);
    }
    if (searchCriteria.supplierName) {
      whereClause.supplierName = Like(`%${searchCriteria.supplierName}%`);
    }
    if (searchCriteria.locationId) {
      whereClause.locationId = parseInt(searchCriteria.locationId, 10);
    }
    if (searchCriteria.contactPerson) {
      whereClause.contactPerson = Like(`%${searchCriteria.contactPerson}%`);
    }
    if (searchCriteria.phone) {
      whereClause.phone = Like(`%${searchCriteria.phone}%`);
    }
    if (searchCriteria.email) {
      whereClause.email = Like(`%${searchCriteria.email}%`);
    }
    if (searchCriteria.jib) {
      whereClause.jib = Like(`%${searchCriteria.jib}%`);
    }
    if (searchCriteria.pdvNumber) {
      whereClause.pdvNumber = Like(`%${searchCriteria.pdvNumber}%`);
    }
    if (searchCriteria.note) {
      whereClause.note = Like(`%${searchCriteria.note}%`);
    }

    return this.supplierRepository.find({
      where: whereClause,
      relations: ['location'],
    });
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier | null> {
    const supplierToUpdate = await this.supplierRepository.findOne({
      where: { id },
    });

    if (!supplierToUpdate) {
      return null;
    }

    if (
      updateSupplierDto.supplierName &&
      updateSupplierDto.supplierName !== supplierToUpdate.supplierName
    ) {
      const existingSupplierByName = await this.supplierRepository.findOne({
        where: { supplierName: updateSupplierDto.supplierName },
      });
      if (existingSupplierByName && existingSupplierByName.id !== id) {
        throw new ConflictException(
          `Dobavljač s imenom '${updateSupplierDto.supplierName}' već postoji.`,
        );
      }
    }

    if (
      updateSupplierDto.locationId !== undefined &&
      updateSupplierDto.locationId !== null &&
      updateSupplierDto.locationId !== supplierToUpdate.locationId
    ) {
      const existingLocation = await this.locationRepository.findOne({
        where: { id: updateSupplierDto.locationId },
      });
      if (!existingLocation) {
        throw new BadRequestException(
          `Lokacija s ID-em ${updateSupplierDto.locationId} nije pronađena.`,
        );
      }
    }

    this.supplierRepository.merge(supplierToUpdate, {
      ...updateSupplierDto,
    });

    return this.supplierRepository.save(supplierToUpdate);
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.supplierRepository.delete(id);
    return deleteResult.affected !== 0;
  }
}
