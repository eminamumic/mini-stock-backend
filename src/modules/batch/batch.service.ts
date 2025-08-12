import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Batch } from 'src/entities/batch/batch';
import { Product } from 'src/entities/product/product';
import { CreateBatchDto } from './dto/create-batch.dto';
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

  async getDistinctProductsInBatches(): Promise<Product[]> {
    const batches = await this.batchRepository.find({
      relations: ['product'],
      select: { productId: true },
    });
    const uniqueProductIds = new Set<number>(
      batches.map((batch) => batch.productId),
    );
    if (uniqueProductIds.size === 0) {
      return [];
    }
    return this.productRepository.findByIds(Array.from(uniqueProductIds));
  }

  async getDistinctExpirationDates(): Promise<Date[]> {
    const batches = await this.batchRepository.find({
      select: { expirationDate: true },
      where: { expirationDate: MoreThanOrEqual(new Date()) },
    });

    const uniqueDates = new Set<string>();
    batches.forEach((batch) => {
      if (batch.expirationDate) {
        const expirationDate =
          typeof batch.expirationDate === 'string'
            ? new Date(batch.expirationDate)
            : batch.expirationDate;

        uniqueDates.add(expirationDate.toISOString().split('T')[0]);
      }
    });

    return Array.from(uniqueDates)
      .sort()
      .map((dateString) => new Date(dateString));
  }

  async searchBatches(searchCriteria: SearchBatchDto): Promise<Batch[]> {
    const query = this.batchRepository
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.product', 'product');

    if (searchCriteria.id) {
      query.andWhere('batch.id = :id', { id: searchCriteria.id });
    }
    if (searchCriteria.productId) {
      query.andWhere('batch.productId = :productId', {
        productId: searchCriteria.productId,
      });
    }
    if (searchCriteria.serialNumber) {
      query.andWhere('batch.serialNumber LIKE :serialNumber', {
        serialNumber: `%${searchCriteria.serialNumber}%`,
      });
    }
    if (searchCriteria.lotNumber) {
      query.andWhere('batch.lotNumber LIKE :lotNumber', {
        lotNumber: `%${searchCriteria.lotNumber}%`,
      });
    }
    if (searchCriteria.productionDate) {
      query.andWhere('batch.productionDate = :productionDate', {
        productionDate: searchCriteria.productionDate,
      });
    }
    if (searchCriteria.expirationDate) {
      query.andWhere('batch.expirationDate = :expirationDate', {
        expirationDate: searchCriteria.expirationDate,
      });
    }
    if (searchCriteria.purchasePrice) {
      query.andWhere('batch.purchasePrice = :purchasePrice', {
        purchasePrice: searchCriteria.purchasePrice,
      });
    }
    if (searchCriteria.salePrice) {
      query.andWhere('batch.salePrice = :salePrice', {
        salePrice: searchCriteria.salePrice,
      });
    }

    if (searchCriteria.note) {
      query.andWhere('batch.note LIKE :note', {
        note: `%${searchCriteria.note}%`,
      });
    }

    if (searchCriteria.minQuantity && searchCriteria.maxQuantity) {
      query.andWhere('batch.quantity BETWEEN :minQuantity AND :maxQuantity', {
        minQuantity: searchCriteria.minQuantity,
        maxQuantity: searchCriteria.maxQuantity,
      });
    } else if (searchCriteria.minQuantity) {
      query.andWhere('batch.quantity >= :minQuantity', {
        minQuantity: searchCriteria.minQuantity,
      });
    } else if (searchCriteria.maxQuantity) {
      query.andWhere('batch.quantity <= :maxQuantity', {
        maxQuantity: searchCriteria.maxQuantity,
      });
    }

    return query.getMany();
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
