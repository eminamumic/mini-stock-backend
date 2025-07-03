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
}
