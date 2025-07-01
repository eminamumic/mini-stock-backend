import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockLevelDto {
  @ApiProperty({
    description: 'The ID of the product for which the stock level is recorded.',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Product ID must be a positive number.' })
  productId: number;

  @ApiProperty({
    description: 'The ID of the warehouse where the stock level is recorded.',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Warehouse ID must be a positive number.' })
  warehouseId: number;

  @ApiProperty({
    description:
      'The current quantity of the product in the specified warehouse.',
    example: 100.5,
    required: false,
    type: 'number',
    format: 'float',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Current quantity cannot be negative.' })
  currentQuantity?: number;

  @ApiProperty({
    description: 'The reorder level for the product in this warehouse.',
    example: 20.0,
    required: false,
    type: 'number',
    format: 'float',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Reorder level cannot be negative.' })
  reorderLevel?: number;

  @ApiProperty({
    description:
      'The quantity to reorder when the stock level falls below the reorder level.',
    example: 50.0,
    required: false,
    type: 'number',
    format: 'float',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0, { message: 'Reorder quantity cannot be negative.' })
  reorderQuantity?: number;

  @ApiProperty({
    description:
      'The date of the last stock take for this product in this warehouse (YYYY-MM-DD format).',
    example: '2024-06-25',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  lastStockTakeDate?: Date;
}
