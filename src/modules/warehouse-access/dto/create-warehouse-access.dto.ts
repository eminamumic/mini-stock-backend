import {
  IsNumber,
  IsNotEmpty,
  Min,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseAccessDto {
  @ApiProperty({
    description: 'The ID of the employee being granted access.',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Employee ID must be a positive number.' })
  employeeId: number;

  @ApiProperty({
    description: 'The ID of the warehouse to which access is being granted.',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Warehouse ID must be a positive number.' })
  warehouseId: number;

  @ApiProperty({
    description: 'The date when the access was revoked (YYYY-MM-DD format).',
    example: '2025-01-01',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  revocationDate?: Date;
}
