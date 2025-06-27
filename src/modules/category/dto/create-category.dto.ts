// src/category/dto/create-category.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category (e.g., "Electronics", "Beverages")',
    example: 'Drink',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'A brief description of the category',
    example: 'Non-alcoholic beverages such as water, juice, and soda',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description:
      'The ID of the parent category, if applicable (for hierarchical categories)',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  parentCategoryId?: number;

  @ApiProperty({
    description:
      'The hierarchical level of the category (e.g., 1 for top-level, 2 for sub-category)',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  hierarchyLevel?: number;

  @ApiProperty({
    description: 'The type of category (e.g., "Product", "Service", "Blog")',
    example: 'Product',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  categoryType?: string;
}
