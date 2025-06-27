import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateCategory {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  parentChategoryId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  hierarchyLevel?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  categoryType?: string;
}
