import {
  IsString,
  IsOptional,
  IsNumberString,
  IsBooleanString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchWarehouseDto {
  @ApiProperty({
    description: 'The ID of the warehouse for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id?: string;

  @ApiProperty({
    description: 'Name of the warehouse for searching ',
    example: 'Main',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Location ID for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  locationId?: string;

  @ApiProperty({
    description: 'Warehouse Type ID for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  warehouseTypeId?: string;

  @ApiProperty({
    description: 'Creation date for searching (YYYY-MM-DD format).',
    example: '2024-01-01',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @ApiProperty({
    description: 'Is the warehouse active for searching (true/false)',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBooleanString()
  isActive?: boolean;
}
