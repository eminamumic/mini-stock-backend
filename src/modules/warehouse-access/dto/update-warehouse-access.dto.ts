import { PartialType } from '@nestjs/mapped-types';
import { CreateWarehouseAccessDto } from './create-warehouse-access.dto';
import { IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWarehouseAccessDto extends PartialType(
  CreateWarehouseAccessDto,
) {
  @ApiProperty({
    description: 'Is the access currently active?',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'The date when the access was revoked (YYYY-MM-DD format). ',
    example: '2025-01-01',
    required: false,
    nullable: true,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  revocationDate?: Date;
}
