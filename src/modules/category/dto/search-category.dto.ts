import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class SearchCategoryDto {
  @IsOptional()
  @IsNumberString()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumberString()
  parentCategoryId?: number;

  @IsOptional()
  @IsNumberString()
  hierarchyLevel?: number;

  @IsOptional()
  @IsString()
  categoryType?: string;
}
