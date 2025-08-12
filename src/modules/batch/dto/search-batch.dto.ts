import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchBatchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lotNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  productionDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expirationDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  purchasePrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  minQuantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxQuantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
