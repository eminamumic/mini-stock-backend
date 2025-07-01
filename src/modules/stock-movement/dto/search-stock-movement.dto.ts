import {
  IsString,
  IsOptional,
  IsNumberString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchStockMovementDto {
  @ApiProperty({
    description: 'The ID of the stock movement record for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id?: number;

  @ApiProperty({
    description: 'Process number for searching',
    example: '12345',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  processNumber?: number;

  @ApiProperty({
    description: 'Movement timestamp for searching (YYYY-MM-DD format).',
    example: '2024-06-25',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  movementTimestamp?: Date;

  @ApiProperty({
    description: 'Type of stock movement for searching.',
    example: 'In',
    required: false,
  })
  @IsOptional()
  @IsString()
  movementType?: string;

  @ApiProperty({
    description: 'Product ID for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  productId?: number;

  @ApiProperty({
    description: 'Batch ID for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  batchId?: number;

  @ApiProperty({
    description: 'Quantity for searching ',
    example: '10.50',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  quantity?: number;

  @ApiProperty({
    description: 'Source warehouse ID for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  sourceWarehouseId?: number;

  @ApiProperty({
    description: 'Destination warehouse ID for searching',
    example: '2',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  destinationWarehouseId?: number;

  @ApiProperty({
    description: 'Employee ID for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  employeeId?: number;

  @ApiProperty({
    description: 'Supplier ID for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  supplierId?: number;

  @ApiProperty({
    description: 'Reference document for searching ',
    example: 'INV-2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  referenceDocument?: string;

  @ApiProperty({
    description: 'Notes for searching ',
    example: 'damaged',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
