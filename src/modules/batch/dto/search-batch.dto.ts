import {
  IsString,
  IsOptional,
  IsNumberString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchBatchDto {
  @ApiProperty({
    description: 'The ID of the batch for searching',
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
    description: 'Serial number for searching',
    example: 'SN123',
    required: false,
  })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiProperty({
    description: 'Lot number for searching',
    example: 'LOT-XYZ',
    required: false,
  })
  @IsOptional()
  @IsString()
  lotNumber?: string;

  @ApiProperty({
    description: 'Production date for searching (YYYY-MM-DD format).',
    example: '2023-01-01',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  productionDate?: Date;

  @ApiProperty({
    description: 'Expiration date for searching (YYYY-MM-DD format).',
    example: '2025-12-31',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  expirationDate?: Date;

  @ApiProperty({
    description:
      'Purchase price for searching (exact match or range in service).',
    example: '15.75',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  purchasePrice?: number;

  @ApiProperty({
    description: 'Sale price for searching (exact match or range in service).',
    example: '25.99',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  salePrice?: number;

  @ApiProperty({
    description: 'Status of the batch for searching.',
    example: 'Active',

    required: false,
  })
  @IsOptional()
  @IsString()
  batchStatus?: string;

  @ApiProperty({
    description: 'Notes for searching',
    example: 'damage',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
