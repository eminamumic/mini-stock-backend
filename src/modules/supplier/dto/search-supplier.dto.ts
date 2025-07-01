import {
  IsString,
  IsOptional,
  IsNumberString,
  IsBooleanString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchSupplierDto {
  @ApiProperty({
    description: 'The ID of the supplier for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id?: number;

  @ApiProperty({
    description: 'Supplier name for searching',
    example: 'Global',
    required: false,
  })
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiProperty({
    description: 'Location ID for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  locationId?: number;

  @ApiProperty({
    description: 'Contact person for searching ',
    example: 'Emina',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiProperty({
    description: 'Phone number for searching',
    example: '+387 63 224 432',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Email address for searching ',
    example: 'emina@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'JIB for searching ',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  jib?: string;

  @ApiProperty({
    description: 'PDV number for searching ',
    example: '456',
    required: false,
  })
  @IsOptional()
  @IsString()
  pdvNumber?: string;

  @ApiProperty({
    description: 'Is the supplier active for searching (true/false)',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBooleanString()
  isActive?: boolean;

  @ApiProperty({
    description: 'Notes for searching ',
    example: 'preferred',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
