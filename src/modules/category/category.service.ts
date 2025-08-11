import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category/category';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindOptionsWhere } from 'typeorm';
import { Like } from 'typeorm';

import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['children', 'parentCategory'],
    });
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['children', 'parentCategory'],
    });
  }

  async searchCategories(
    searchCriteria: SearchCategoryDto,
  ): Promise<Category[]> {
    const whereClause: FindOptionsWhere<Category> = {};

    if (searchCriteria.id) {
      whereClause.id = searchCriteria.id;
    }
    if (searchCriteria.name) {
      whereClause.name = Like(`%${searchCriteria.name}%`);
    }
    if (searchCriteria.description) {
      whereClause.description = Like(`%${searchCriteria.description}%`);
    }
    if (searchCriteria.parentCategoryId) {
      whereClause.parentCategory = { id: searchCriteria.parentCategoryId };
    }
    if (searchCriteria.hierarchyLevel) {
      whereClause.hierarchyLevel = searchCriteria.hierarchyLevel;
    }
    if (searchCriteria.categoryType) {
      whereClause.categoryType = Like(`%${searchCriteria.categoryType}%`);
    }

    return this.categoryRepository.find({
      where: whereClause,
      relations: ['children', 'parentCategory'],
    });
  }
  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    const categoryToUpdate = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!categoryToUpdate) {
      return null;
    }

    this.categoryRepository.merge(categoryToUpdate, updateCategoryDto);
    return this.categoryRepository.save(categoryToUpdate);
  }

  async deleteCategory(id: number): Promise<boolean> {
    const deleteResult = await this.categoryRepository.delete(id);

    return deleteResult.affected !== 0;
  }

  async getDistinctParentCategories(): Promise<number[]> {
    const categories = await this.categoryRepository.find({
      select: ['parentCategoryId'],
    });
    const parentCategoryIds = new Set(
      categories.map((category) => category.parentCategoryId),
    );

    const filteredIds = Array.from(parentCategoryIds).filter(
      (id) => id !== null,
    );

    return filteredIds;
  }
}
