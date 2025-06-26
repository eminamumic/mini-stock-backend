import {
  IsNumber,
  IsOptional,
  IsString,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchLocationDto {
  @ApiProperty({
    description: 'ID of the location',
    required: false,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    description: 'Address to search for (partial match)',
    example: 'Main',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'City to search for',
    example: 'Springfield',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'State to search for',
    example: 'IL',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'ZIP code to search for',
    example: '62704',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNumberString()
  zipCode?: string;

  @ApiProperty({
    description: 'Notes to search for (partial match)',
    example: 'Park',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
