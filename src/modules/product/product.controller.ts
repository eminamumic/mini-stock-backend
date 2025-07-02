// src/product/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ConflictException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { Product } from 'src/entities/product/product';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error('Failed to create product.');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async search(@Query() searchDto: SearchProductDto): Promise<Product[]> {
    return this.productService.search(searchDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<Product> {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return product;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const updatedProduct = await this.productService.update(
        id,
        updateProductDto,
      );
      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID ${id} not found.`);
      }
      return updatedProduct;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error('Failed to update product.');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    const deleted = await this.productService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
  }
}
