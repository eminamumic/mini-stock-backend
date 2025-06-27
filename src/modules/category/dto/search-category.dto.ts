import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchCategoryDto {
  @ApiProperty({
    description: 'The ID of the category for searching.',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id?: number;

  @ApiProperty({
    description:
      'The name of the category for searching (partial match is supported).',
    example: 'Electron',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description:
      'A description for searching categories (partial match is supported).',
    example: 'beverages',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The ID of the parent category for searching.',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  parentCategoryId?: number;

  @ApiProperty({
    description: 'The hierarchy level of the category for searching.',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  hierarchyLevel?: number;

  @ApiProperty({
    description: 'The type of category for searching.',
    example: 'Product',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryType?: string;
}
