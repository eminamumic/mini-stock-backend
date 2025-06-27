import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
} from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';

import { CategoryService } from './category.service';
import { Category } from 'src/entities/category/category';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Category[]> {
    return this.categoryService.getAllCategories();
  }
}
