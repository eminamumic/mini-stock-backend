// src/product/dto/search-product.dto.ts
import {
  IsString,
  IsOptional,
  IsNumberString,
  IsBooleanString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchProductDto {
  @ApiProperty({
    description: 'The ID of the product for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id?: number;

  @ApiProperty({
    description: 'Product code for searching',
    example: 'PROD-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  productCode?: string;

  @ApiProperty({
    description: 'Name of the product for searching',
    example: 'Laptop',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Category ID for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  @Min(1)
  categoryId?: number;

  @ApiProperty({
    description: 'Warehouse ID for filtering',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  warehouseId?: number;

  @ApiProperty({
    description: 'Supplier ID for filtering',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  supplierId?: number;

  @ApiProperty({
    description: 'Description for searching',
    example: 'high-performance',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Unit of measure for searching ',
    example: 'pcs',
    required: false,
  })
  @IsOptional()
  @IsString()
  unitOfMeasure?: string;

  @ApiProperty({
    description: 'Minimum quantity for searching',
    example: '10',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  @Min(1)
  minQuantity?: number;

  @ApiProperty({
    description: 'Unit weight for searching ',
    example: '2.5',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  @Min(0)
  unitWeight?: number;

  @ApiProperty({
    description: 'Minimum storage temperature for searching ',
    example: '5.00',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  storageTempMin?: number;

  @ApiProperty({
    description: 'Maximum storage temperature for searching ',
    example: '25.00',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  storageTempMax?: number;

  @ApiProperty({
    description: 'Is the product active for searching (true/false)',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBooleanString()
  isActive?: boolean;
}
