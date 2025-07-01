import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Unique name of the supplier',
    example: 'Global Supplies Inc.',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  supplierName: string;

  @ApiProperty({
    description: 'The ID of the location associated with this supplier.',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Location ID must be a positive number.' })
  locationId?: number;

  @ApiProperty({
    description: 'Contact person for the supplier',
    example: 'Emina Mumic',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contactPerson?: string;

  @ApiProperty({
    description: 'Phone number of the supplier',
    example: '+387 65 334 211',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiProperty({
    description: 'Email address of the supplier',
    example: 'info@globalsupplies.com',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: 'JIB (Jedinstveni Identifikacioni Broj) of the supplier',
    example: '1234567890123',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  jib?: string;

  @ApiProperty({
    description: 'PDV  number of the supplier',
    example: '123456789',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  pdvNumber?: string;

  @ApiProperty({
    description: 'Additional notes about the supplier.',
    example: 'Preferred supplier for electronics components.',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
