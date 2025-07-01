// src/product/dto/create-product.dto.ts
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Unique code for the product',
    example: 'PROD-001-XYZ',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  productCode: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Laptop Pro 15',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'The ID of the category this product belongs to.',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Category ID must be a positive number.' })
  categoryId?: number;

  @ApiProperty({
    description: 'Detailed description of the product',
    example: 'High-performance laptop with 16GB RAM and 512GB SSD.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Unit of measure for the product (e.g., "pcs", "kg", "liter")',
    example: 'pcs',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  unitOfMeasure: string;

  @ApiProperty({
    description: 'Minimum quantity of the product to be kept in stock.',
    example: 10.0,
    required: false,
    type: 'number',
    format: 'float',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minQuantity?: number;

  @ApiProperty({
    description: 'Weight of a single unit of the product.',
    example: 2.5,
    required: false,
    type: 'number',
    format: 'float',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitWeight?: number;

  @ApiProperty({
    description: 'Minimum recommended storage temperature for the product.',
    example: 5.0,
    required: false,
    type: 'number',
    format: 'float',
  })
  @IsOptional()
  @IsNumber()
  @Min(-273.15)
  @Max(1000)
  storageTempMin?: number;

  @ApiProperty({
    description: 'Maximum recommended storage temperature for the product.',
    example: 25.0,
    required: false,
    type: 'number',
    format: 'float',
  })
  @IsOptional()
  @IsNumber()
  @Min(-273.15)
  @Max(1000)
  storageTempMax?: number;
}
