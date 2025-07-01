import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'Unique name of the warehouse',
    example: 'Main Distribution Center',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'The ID of the location where the warehouse is situated.',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Location ID must be a positive number.' })
  locationId?: number;

  @ApiProperty({
    description:
      'The ID of the type of warehouse (e.g., "Cold Storage", "Dry Storage").',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Warehouse Type ID must be a positive number.' })
  warehouseTypeId?: number;
}
