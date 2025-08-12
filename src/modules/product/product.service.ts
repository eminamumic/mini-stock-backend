import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product/product';
import { Category } from 'src/entities/category/category';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { Supplier } from 'src/entities/supplier/supplier';
import { Warehouse } from 'src/entities/warehouse/warehouse';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
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

  async getDistinctCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });

    const uniqueCategoriesMap = new Map<number, Category>();
    categories.forEach((category) => {
      uniqueCategoriesMap.set(category.id, category);
    });

    return Array.from(uniqueCategoriesMap.values());
  }

  async getDistinctSuppliers(): Promise<Supplier[]> {
    const suppliers = await this.supplierRepository.find({
      select: ['id', 'supplierName'],
      order: { supplierName: 'ASC' },
    });

    const uniqueSuppliersMap = new Map<number, Supplier>();
    suppliers.forEach((supplier) => {
      uniqueSuppliersMap.set(supplier.id, supplier);
    });

    return Array.from(uniqueSuppliersMap.values());
  }

  async getDistinctWarehouses(): Promise<Warehouse[]> {
    const warehouses = await this.warehouseRepository.find({
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });

    const uniqueWarehousesMap = new Map<number, Warehouse>();
    warehouses.forEach((warehouse) => {
      uniqueWarehousesMap.set(warehouse.id, warehouse);
    });

    return Array.from(uniqueWarehousesMap.values());
  }

  async search(searchCriteria: SearchProductDto): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder.leftJoinAndSelect('product.category', 'category');
    queryBuilder.leftJoinAndSelect('product.batches', 'batch');

    if (searchCriteria.id) {
      queryBuilder.andWhere('product.id = :id', { id: searchCriteria.id });
    }
    if (searchCriteria.productCode) {
      queryBuilder.andWhere('product.productCode LIKE :productCode', {
        productCode: `%${searchCriteria.productCode}%`,
      });
    }
    if (searchCriteria.name) {
      queryBuilder.andWhere('product.name LIKE :name', {
        name: `%${searchCriteria.name}%`,
      });
    }
    if (searchCriteria.categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', {
        categoryId: searchCriteria.categoryId,
      });
    }
    if (searchCriteria.description) {
      queryBuilder.andWhere('product.description LIKE :description', {
        description: `%${searchCriteria.description}%`,
      });
    }
    if (searchCriteria.unitOfMeasure) {
      queryBuilder.andWhere('product.unitOfMeasure LIKE :unitOfMeasure', {
        unitOfMeasure: `%${searchCriteria.unitOfMeasure}%`,
      });
    }
    if (searchCriteria.minQuantity !== undefined) {
      queryBuilder.andWhere('product.minQuantity = :minQuantity', {
        minQuantity: searchCriteria.minQuantity,
      });
    }
    if (searchCriteria.unitWeight !== undefined) {
      queryBuilder.andWhere('product.unitWeight = :unitWeight', {
        unitWeight: searchCriteria.unitWeight,
      });
    }
    if (searchCriteria.storageTempMin !== undefined) {
      queryBuilder.andWhere('product.storageTempMin = :storageTempMin', {
        storageTempMin: searchCriteria.storageTempMin,
      });
    }
    if (searchCriteria.storageTempMax !== undefined) {
      queryBuilder.andWhere('product.storageTempMax = :storageTempMax', {
        storageTempMax: searchCriteria.storageTempMax,
      });
    }
    if (searchCriteria.isActive !== undefined) {
      queryBuilder.andWhere('product.isActive = :isActive', {
        isActive: searchCriteria.isActive,
      });
    }

    if (searchCriteria.warehouseId) {
      queryBuilder.andWhere('batch.warehouseId = :warehouseId', {
        warehouseId: searchCriteria.warehouseId,
      });
    }

    if (searchCriteria.supplierId) {
      queryBuilder.andWhere('batch.supplierId = :supplierId', {
        supplierId: searchCriteria.supplierId,
      });
    }

    return queryBuilder.getMany();
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
