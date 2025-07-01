import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBatchDto {
  @ApiProperty({
    description: 'The ID of the product this batch belongs to.',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Product ID must be a positive number.' })
  productId: number;

  @ApiProperty({
    description: 'Unique serial number for the batch.',
    example: 'SN123456789',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  serialNumber?: string;

  @ApiProperty({
    description: 'Unique lot number for the batch.',
    example: 'LOT-XYZ-2023-001',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lotNumber?: string;

  @ApiProperty({
    description: 'Date of production for the batch (YYYY-MM-DD format).',
    example: '2023-01-01',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  productionDate?: Date;

  @ApiProperty({
    description: 'Expiration date for the batch (YYYY-MM-DD format).',
    example: '2025-12-31',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  expirationDate?: Date;

  @ApiProperty({
    description: 'Purchase price of the products in this batch.',
    example: 15.75,
    required: false,
    type: 'number',
    format: 'float',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  purchasePrice?: number;

  @ApiProperty({
    description: 'Sale price of the products in this batch.',
    example: 25.99,
    required: false,
    type: 'number',
    format: 'float',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  salePrice?: number;

  @ApiProperty({
    description: 'Current status of the batch (e.g., "Active", "Expired").',
    example: 'Active',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  batchStatus: string;

  @ApiProperty({
    description: 'Additional notes about the batch.',
    example: 'Received with minor packaging damage.',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
