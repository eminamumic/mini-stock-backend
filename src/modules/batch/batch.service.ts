// src/batch/batch.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Batch } from 'src/entities/batch/batch';
import { Product } from 'src/entities/product/product'; // Potrebno za proveru productId
import { CreateBatchDto } from './dto/create-batch.dto'; // Importujemo enum
import { UpdateBatchDto } from './dto/update-batch.dto';
import { SearchBatchDto } from './dto/search-batch.dto';

@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createBatch(createBatchDto: CreateBatchDto): Promise<Batch> {
    const productExists = await this.productRepository.findOne({
      where: { id: createBatchDto.productId },
    });
    if (!productExists) {
      throw new NotFoundException(
        `Product with ID ${createBatchDto.productId} not found.`,
      );
    }

    if (createBatchDto.serialNumber) {
      const existingBatchBySerial = await this.batchRepository.findOne({
        where: { serialNumber: createBatchDto.serialNumber },
      });
      if (existingBatchBySerial) {
        throw new ConflictException(
          `Batch with serial number "${createBatchDto.serialNumber}" already exists.`,
        );
      }
    }

    if (createBatchDto.lotNumber) {
      const existingBatchByLot = await this.batchRepository.findOne({
        where: { lotNumber: createBatchDto.lotNumber },
      });
      if (existingBatchByLot) {
        throw new ConflictException(
          `Batch with lot number "${createBatchDto.lotNumber}" already exists.`,
        );
      }
    }

    const newBatch = this.batchRepository.create({
      ...createBatchDto,
    });

    return this.batchRepository.save(newBatch);
  }

  async getAllBatches(): Promise<Batch[]> {
    return this.batchRepository.find({ relations: ['product'] });
  }

  async getBatchById(id: number): Promise<Batch | null> {
    return this.batchRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async searchBatches(searchCriteria: SearchBatchDto): Promise<Batch[]> {
    const whereClause: FindOptionsWhere<Batch> = {};

    if (searchCriteria.id) {
      whereClause.id = searchCriteria.id;
    }
    if (searchCriteria.productId) {
      whereClause.product = { id: searchCriteria.productId };
    }
    if (searchCriteria.serialNumber) {
      whereClause.serialNumber = Like(`%${searchCriteria.serialNumber}%`);
    }
    if (searchCriteria.lotNumber) {
      whereClause.lotNumber = Like(`%${searchCriteria.lotNumber}%`);
    }
    if (searchCriteria.productionDate) {
      whereClause.productionDate = searchCriteria.productionDate;
    }
    if (searchCriteria.expirationDate) {
      whereClause.expirationDate = searchCriteria.expirationDate;
    }
    if (searchCriteria.purchasePrice) {
      whereClause.purchasePrice = searchCriteria.purchasePrice;
    }
    if (searchCriteria.salePrice) {
      whereClause.salePrice = searchCriteria.salePrice;
    }
    if (searchCriteria.batchStatus) {
      whereClause.batchStatus = searchCriteria.batchStatus;
    }
    if (searchCriteria.note) {
      whereClause.note = Like(`%${searchCriteria.note}%`);
    }

    return this.batchRepository.find({
      where: whereClause,
      relations: ['product'],
    });
  }

  async updateBatch(
    id: number,
    updateBatchDto: UpdateBatchDto,
  ): Promise<Batch | null> {
    const batchToUpdate = await this.batchRepository.findOne({ where: { id } });

    if (!batchToUpdate) {
      return null;
    }

    if (
      updateBatchDto.productId &&
      updateBatchDto.productId !== batchToUpdate.productId
    ) {
      const productExists = await this.productRepository.findOne({
        where: { id: updateBatchDto.productId },
      });
      if (!productExists) {
        throw new NotFoundException(
          `Product with ID ${updateBatchDto.productId} not found.`,
        );
      }
    }

    if (
      updateBatchDto.serialNumber &&
      updateBatchDto.serialNumber !== batchToUpdate.serialNumber
    ) {
      const existingBatchBySerial = await this.batchRepository.findOne({
        where: { serialNumber: updateBatchDto.serialNumber },
      });
      if (existingBatchBySerial && existingBatchBySerial.id !== id) {
        throw new ConflictException(
          `Batch with serial number "${updateBatchDto.serialNumber}" already exists.`,
        );
      }
    }

    if (
      updateBatchDto.lotNumber &&
      updateBatchDto.lotNumber !== batchToUpdate.lotNumber
    ) {
      const existingBatchByLot = await this.batchRepository.findOne({
        where: { lotNumber: updateBatchDto.lotNumber },
      });
      if (existingBatchByLot && existingBatchByLot.id !== id) {
        throw new ConflictException(
          `Batch with lot number "${updateBatchDto.lotNumber}" already exists.`,
        );
      }
    }

    this.batchRepository.merge(batchToUpdate, updateBatchDto);
    return this.batchRepository.save(batchToUpdate);
  }

  async deleteBatch(id: number): Promise<boolean> {
    const deleteResult = await this.batchRepository.delete(id);
    return deleteResult.affected !== 0;
  }
}
