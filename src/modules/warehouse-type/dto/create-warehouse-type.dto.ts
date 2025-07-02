import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseTypeDto {
  @ApiProperty({
    description:
      'Unique name for the warehouse type (e.g., "Cold Storage", "Dry Storage")',
    example: 'Cold Storage',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  typeName: string;

  @ApiProperty({
    description: 'A brief description of the warehouse type',
    example: 'Warehouse type designed for storing temperature-sensitive goods.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description:
      'Indicates if this warehouse type requires temperature control.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresTempControl?: boolean;

  @ApiProperty({
    description:
      'Minimum temperature in Celsius required for this warehouse type.',
    example: 0.0,
    required: false,
    type: 'number',
    format: 'float',
  })
  @IsOptional()
  @IsNumber()
  @Min(-273.15)
  @Max(100)
  minTemperatureC?: number;

  @ApiProperty({
    description:
      'Maximum temperature in Celsius required for this warehouse type.',
    example: 10.0,
    required: false,
    type: 'number',
    format: 'float',
  })
  @IsOptional()
  @IsNumber()
  @Min(-273.15)
  @Max(100)
  maxTemperatureC?: number;
}
