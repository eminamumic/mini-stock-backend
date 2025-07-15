import {
  IsString,
  IsOptional,
  IsNumberString,
  IsBooleanString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchWarehouseTypeDto {
  @ApiProperty({
    description: 'The ID of the warehouse type record for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id?: string;

  @ApiProperty({
    description: 'Name of the warehouse type for searching',
    example: 'Cold',
    required: false,
  })
  @IsOptional()
  @IsString()
  typeName?: string;

  @ApiProperty({
    description: 'Description of the warehouse type for searching',
    example: 'temperature-sensitive',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description:
      'Indicates if this warehouse type requires temperature control for searching (true/false)',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBooleanString()
  requiresTempControl?: string;

  @ApiProperty({
    description: 'Minimum temperature in Celsius for searching',
    example: '0.0',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  minTemperatureC?: string;

  @ApiProperty({
    description: 'Maximum temperature in Celsius for searching',
    example: '10.0',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  maxTemperatureC?: string;

  @ApiProperty({
    description: 'Creation date for searching (YYYY-MM-DD format).',
    example: '2024-01-01',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  createdAt?: string;
}
