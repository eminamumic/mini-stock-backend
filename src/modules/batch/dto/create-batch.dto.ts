import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBatchDto {
  @ApiProperty({
    description: 'ID of the product associated with this batch',
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  productId: number;

  @ApiPropertyOptional({
    description: 'Serial number of the batch',
    example: 'SN-001',
  })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional({
    description: 'Lot number of the batch',
    example: 'LOT-123',
  })
  @IsOptional()
  @IsString()
  lotNumber?: string;

  @ApiPropertyOptional({
    description: 'Production date of the batch',
    example: '2025-08-22',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  productionDate?: string;

  @ApiPropertyOptional({
    description: 'Expiration date of the batch',
    example: '2026-08-22',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @ApiPropertyOptional({
    description: 'Purchase price of the batch',
    example: 12.5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  purchasePrice?: number;

  @ApiPropertyOptional({
    description: 'Sale price of the batch',
    example: 15.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salePrice?: number;

  @ApiProperty({
    description: 'Initial quantity of items in the batch',
    example: 100,
    minimum: 0,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Additional notes about the batch',
    example: 'Handle with care',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
