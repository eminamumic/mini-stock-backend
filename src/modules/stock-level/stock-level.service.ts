import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockLevel } from 'src/entities/stock-level/stock-level';
import { Product } from 'src/entities/product/product';
import { Warehouse } from 'src/entities/warehouse/warehouse';
import { CreateStockLevelDto } from './dto/create-stock-level.dto';
import { UpdateStockLevelDto } from './dto/update-stock-level.dto';
import { SearchStockLevelDto } from './dto/search-stock-level.dto';

@Injectable()
export class StockLevelService {
  constructor(
    @InjectRepository(StockLevel)
    private readonly stockLevelRepository: Repository<StockLevel>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(createStockLevelDto: CreateStockLevelDto): Promise<StockLevel> {
    const existingProduct = await this.productRepository.findOne({
      where: { id: createStockLevelDto.productId },
    });
    if (!existingProduct) {
      throw new BadRequestException(
        `Product with ID ${createStockLevelDto.productId} not found.`,
      );
    }

    const existingWarehouse = await this.warehouseRepository.findOne({
      where: { id: createStockLevelDto.warehouseId },
    });
    if (!existingWarehouse) {
      throw new BadRequestException(
        `Warehouse with ID ${createStockLevelDto.warehouseId} not found.`,
      );
    }

    const existingStockLevel = await this.stockLevelRepository.findOne({
      where: {
        productId: createStockLevelDto.productId,
        warehouseId: createStockLevelDto.warehouseId,
      },
    });
    if (existingStockLevel) {
      throw new ConflictException(
        `Stock level for Product ID ${createStockLevelDto.productId} in Warehouse ID ${createStockLevelDto.warehouseId} already exists.`,
      );
    }

    const newStockLevel = this.stockLevelRepository.create({
      ...createStockLevelDto,
    });

    return this.stockLevelRepository.save(newStockLevel);
  }

  async getAllStockLevels(): Promise<StockLevel[]> {
    return this.stockLevelRepository.find({
      relations: ['product', 'warehouse'],
    });
  }

  async getStockLevelById(id: number): Promise<StockLevel | null> {
    return this.stockLevelRepository.findOne({
      where: { id },
      relations: ['product', 'warehouse'],
    });
  }

  async getDistinctProducts(): Promise<Product[]> {
    const stockLevels = await this.stockLevelRepository.find({
      relations: ['product'],
      select: { productId: true },
    });

    const uniqueProductIds = new Set<number>(
      stockLevels.map((sl) => sl.productId),
    );

    if (uniqueProductIds.size === 0) {
      return [];
    }

    return this.productRepository.findByIds(Array.from(uniqueProductIds));
  }

  async getDistinctWarehouses(): Promise<Warehouse[]> {
    const stockLevels = await this.stockLevelRepository.find({
      relations: ['warehouse'],
      select: { warehouseId: true },
    });

    const uniqueWarehouseIds = new Set<number>(
      stockLevels.map((sl) => sl.warehouseId),
    );

    if (uniqueWarehouseIds.size === 0) {
      return [];
    }

    return this.warehouseRepository.findByIds(Array.from(uniqueWarehouseIds));
  }

  async search(searchCriteria: SearchStockLevelDto): Promise<StockLevel[]> {
    const query = this.stockLevelRepository
      .createQueryBuilder('stockLevel')
      .leftJoinAndSelect('stockLevel.product', 'product')
      .leftJoinAndSelect('stockLevel.warehouse', 'warehouse');

    if (searchCriteria.id) {
      query.andWhere('stockLevel.id = :id', { id: searchCriteria.id });
    }
    if (searchCriteria.productId) {
      query.andWhere('stockLevel.productId = :productId', {
        productId: searchCriteria.productId,
      });
    }
    if (searchCriteria.warehouseId) {
      query.andWhere('stockLevel.warehouseId = :warehouseId', {
        warehouseId: searchCriteria.warehouseId,
      });
    }

    if (searchCriteria.minQuantity) {
      query.andWhere('stockLevel.currentQuantity >= :minQuantity', {
        minQuantity: searchCriteria.minQuantity,
      });
    }
    if (searchCriteria.maxQuantity) {
      query.andWhere('stockLevel.currentQuantity <= :maxQuantity', {
        maxQuantity: searchCriteria.maxQuantity,
      });
    }

    if (searchCriteria.reorderLevel) {
      query.andWhere('stockLevel.reorderLevel = :reorderLevel', {
        reorderLevel: searchCriteria.reorderLevel,
      });
    }
    if (searchCriteria.reorderQuantity) {
      query.andWhere('stockLevel.reorderQuantity = :reorderQuantity', {
        reorderQuantity: searchCriteria.reorderQuantity,
      });
    }
    if (searchCriteria.lastStockTakeDate) {
      query.andWhere('stockLevel.lastStockTakeDate = :lastStockTakeDate', {
        lastStockTakeDate: searchCriteria.lastStockTakeDate,
      });
    }

    if (searchCriteria.orderBy) {
      query.orderBy('stockLevel.currentQuantity', searchCriteria.orderBy);
    }

    return query.getMany();
  }

  async update(
    id: number,
    updateStockLevelDto: UpdateStockLevelDto,
  ): Promise<StockLevel | null> {
    const stockLevelToUpdate = await this.stockLevelRepository.findOne({
      where: { id },
    });

    if (!stockLevelToUpdate) {
      return null;
    }

    if (
      updateStockLevelDto.productId !== undefined &&
      updateStockLevelDto.productId !== stockLevelToUpdate.productId
    ) {
      const existingProduct = await this.productRepository.findOne({
        where: { id: updateStockLevelDto.productId },
      });
      if (!existingProduct) {
        throw new BadRequestException(
          `Product with ID ${updateStockLevelDto.productId} not found.`,
        );
      }
    }

    if (
      updateStockLevelDto.warehouseId !== undefined &&
      updateStockLevelDto.warehouseId !== stockLevelToUpdate.warehouseId
    ) {
      const existingWarehouse = await this.warehouseRepository.findOne({
        where: { id: updateStockLevelDto.warehouseId },
      });
      if (!existingWarehouse) {
        throw new BadRequestException(
          `Warehouse with ID ${updateStockLevelDto.warehouseId} not found.`,
        );
      }
    }

    if (
      (updateStockLevelDto.productId !== undefined &&
        updateStockLevelDto.productId !== stockLevelToUpdate.productId) ||
      (updateStockLevelDto.warehouseId !== undefined &&
        updateStockLevelDto.warehouseId !== stockLevelToUpdate.warehouseId)
    ) {
      const targetProductId =
        updateStockLevelDto.productId || stockLevelToUpdate.productId;
      const targetWarehouseId =
        updateStockLevelDto.warehouseId || stockLevelToUpdate.warehouseId;

      const conflictingStockLevel = await this.stockLevelRepository.findOne({
        where: {
          productId: targetProductId,
          warehouseId: targetWarehouseId,
        },
      });

      if (conflictingStockLevel && conflictingStockLevel.id !== id) {
        throw new ConflictException(
          `Stock level for Product ID ${targetProductId} in Warehouse ID ${targetWarehouseId} already exists.`,
        );
      }
    }

    this.stockLevelRepository.merge(stockLevelToUpdate, {
      ...updateStockLevelDto,
    });

    return this.stockLevelRepository.save(stockLevelToUpdate);
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.stockLevelRepository.delete(id);
    return deleteResult.affected !== 0;
  }
}
