import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
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

  async search(searchCriteria: SearchStockLevelDto): Promise<StockLevel[]> {
    const whereClause: FindOptionsWhere<StockLevel> = {};

    if (searchCriteria.id) {
      whereClause.id = parseInt(searchCriteria.id, 10);
    }
    if (searchCriteria.productId) {
      whereClause.productId = parseInt(searchCriteria.productId, 10);
    }
    if (searchCriteria.warehouseId) {
      whereClause.warehouseId = parseInt(searchCriteria.warehouseId, 10);
    }
    if (searchCriteria.currentQuantity) {
      whereClause.currentQuantity = parseFloat(searchCriteria.currentQuantity);
    }
    if (searchCriteria.reorderLevel) {
      whereClause.reorderLevel = parseFloat(searchCriteria.reorderLevel);
    }
    if (searchCriteria.reorderQuantity) {
      whereClause.reorderQuantity = parseFloat(searchCriteria.reorderQuantity);
    }
    if (searchCriteria.lastStockTakeDate) {
      whereClause.lastStockTakeDate = new Date(
        searchCriteria.lastStockTakeDate,
      );
    }

    return this.stockLevelRepository.find({
      where: whereClause,
      relations: ['product', 'warehouse'],
    });
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
