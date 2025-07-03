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
}
