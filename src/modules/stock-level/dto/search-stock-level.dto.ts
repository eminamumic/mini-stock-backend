import { IsOptional, IsNumberString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchStockLevelDto {
  @ApiProperty({
    description: 'The ID of the stock level record for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id?: number;

  @ApiProperty({
    description: 'The ID of the product for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  productId?: number;

  @ApiProperty({
    description: 'The ID of the warehouse for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  warehouseId?: number;

  @ApiProperty({
    description: 'Current quantity for searching',
    example: '100.50',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  currentQuantity?: number;

  @ApiProperty({
    description: 'Reorder level for searching ',
    example: '20.00',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  reorderLevel?: number;

  @ApiProperty({
    description: 'Reorder quantity for searching ',
    example: '50.00',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
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
  lastStockTakeDate?: Date;
}
