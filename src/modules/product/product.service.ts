import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Product } from 'src/entities/product/product';
import { Category } from 'src/entities/category/category';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    if (createProductDto.categoryId) {
      const categoryExists = await this.categoryRepository.findOne({
        where: { id: createProductDto.categoryId },
      });
      if (!categoryExists) {
        throw new NotFoundException(
          `Category with ID ${createProductDto.categoryId} not found.`,
        );
      }
    }

    const existingProductByCode = await this.productRepository.findOne({
      where: { productCode: createProductDto.productCode },
    });
    if (existingProductByCode) {
      throw new ConflictException(
        `Product with code "${createProductDto.productCode}" already exists.`,
      );
    }

    const newProduct = this.productRepository.create({
      ...createProductDto,
      isActive: true,
      createdAt: new Date(),
      lastUpdatedAt: new Date(),
    });

    return this.productRepository.save(newProduct);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category', 'batches'] });
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['category', 'batches'],
    });
  }

  async search(searchCriteria: SearchProductDto): Promise<Product[]> {
    const whereClause: FindOptionsWhere<Product> = {};

    if (searchCriteria.id) {
      whereClause.id = searchCriteria.id;
    }
    if (searchCriteria.productCode) {
      whereClause.productCode = Like(`%${searchCriteria.productCode}%`);
    }
    if (searchCriteria.name) {
      whereClause.name = Like(`%${searchCriteria.name}%`);
    }
    if (searchCriteria.categoryId) {
      whereClause.category = { id: searchCriteria.categoryId };
    }
    if (searchCriteria.description) {
      whereClause.description = Like(`%${searchCriteria.description}%`);
    }
    if (searchCriteria.unitOfMeasure) {
      whereClause.unitOfMeasure = Like(`%${searchCriteria.unitOfMeasure}%`);
    }
    if (searchCriteria.minQuantity !== undefined) {
      whereClause.minQuantity = searchCriteria.minQuantity;
    }
    if (searchCriteria.unitWeight !== undefined) {
      whereClause.unitWeight = searchCriteria.unitWeight;
    }
    if (searchCriteria.storageTempMin !== undefined) {
      whereClause.storageTempMin = searchCriteria.storageTempMin;
    }
    if (searchCriteria.storageTempMax !== undefined) {
      whereClause.storageTempMax = searchCriteria.storageTempMax;
    }
    if (searchCriteria.isActive !== undefined) {
      whereClause.isActive = searchCriteria.isActive;
    }

    return this.productRepository.find({
      where: whereClause,
      relations: ['category', 'batches'],
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | null> {
    const productToUpdate = await this.productRepository.findOne({
      where: { id },
    });

    if (!productToUpdate) {
      return null;
    }

    if (
      updateProductDto.categoryId &&
      updateProductDto.categoryId !== productToUpdate.categoryId
    ) {
      const categoryExists = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });
      if (!categoryExists) {
        throw new NotFoundException(
          `Category with ID ${updateProductDto.categoryId} not found.`,
        );
      }
    }
    if (
      updateProductDto.productCode &&
      updateProductDto.productCode !== productToUpdate.productCode
    ) {
      const existingProductByCode = await this.productRepository.findOne({
        where: { productCode: updateProductDto.productCode },
      });

      if (existingProductByCode && existingProductByCode.id !== id) {
        throw new ConflictException(
          `Product with code "${updateProductDto.productCode}" already exists.`,
        );
      }
    }

    productToUpdate.lastUpdatedAt = new Date();

    this.productRepository.merge(productToUpdate, updateProductDto);
    return this.productRepository.save(productToUpdate);
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.productRepository.delete(id);
    return deleteResult.affected !== 0;
  }
}
