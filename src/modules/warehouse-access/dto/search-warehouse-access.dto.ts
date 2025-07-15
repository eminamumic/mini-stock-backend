import {
  IsOptional,
  IsNumberString,
  IsBooleanString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchWarehouseAccessDto {
  @ApiProperty({
    description: 'The ID of the warehouse access record for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id?: string;

  @ApiProperty({
    description: 'Employee ID for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  employeeId?: string;

  @ApiProperty({
    description: 'Warehouse ID for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  warehouseId?: string;

  @ApiProperty({
    description: 'Is the access active for searching (true/false)',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBooleanString()
  isActive?: boolean;

  @ApiProperty({
    description: 'Assignment date for searching (YYYY-MM-DD format).',
    example: '2024-01-01',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  assignmentDate?: Date;

  @ApiProperty({
    description: 'Revocation date for searching (YYYY-MM-DD format).',
    example: '2025-01-01',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  revocationDate?: Date;
}
