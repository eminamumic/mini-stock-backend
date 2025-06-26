import { PartialType } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @ApiProperty({
    description: 'The new address of the location',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'The new city of the location', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'The new state/province of the location',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'The new ZIP/postal code of the location',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNumberString()
  zipCode?: string;

  @ApiProperty({
    description: 'Any updated notes about the location',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
