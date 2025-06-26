import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({
    description: 'The address of the location',
    example: '123 Main St',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'The city of the location',
    example: 'Springfield',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'The state/province of the location',
    example: 'IL',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'The ZIP/postal code of the location',
    example: '62704',
  })
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  zipCode: string;

  @ApiProperty({
    description: 'Any additional notes about the location',
    example: 'Near the park',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}
