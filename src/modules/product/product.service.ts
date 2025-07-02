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

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
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
}
