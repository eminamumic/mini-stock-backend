import { IsOptional, IsNumber, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchStockLevelDto {
  @ApiProperty({
    description: 'The ID of the stock level record for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    description: 'The ID of the product for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiProperty({
    description: 'The ID of the warehouse for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  warehouseId?: number;

  @ApiProperty({
    description: 'Minimum quantity for searching',
    example: '10.00',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minQuantity?: number;

  @ApiProperty({
    description: 'Maximum quantity for searching',
    example: '100.00',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxQuantity?: number;

  @ApiProperty({
    description: 'Reorder level for searching ',
    example: '20.00',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  reorderLevel?: number;

  @ApiProperty({
    description: 'Reorder quantity for searching ',
    example: '50.00',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  reorderQuantity?: number;

  @ApiProperty({
    description: 'Last stock take date for searching (YYYY-MM-DD format).',
    example: '2024-06-25',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  lastStockTakeDate?: string;

  @ApiProperty({
    description: 'Sort order for quantity',
    example: 'ASC',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderBy?: 'ASC' | 'DESC';
}
