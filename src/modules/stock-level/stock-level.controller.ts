import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ParseIntPipe,
} from '@nestjs/common';
import { StockLevelService } from './stock-level.service';
import { CreateStockLevelDto } from './dto/create-stock-level.dto';
import { UpdateStockLevelDto } from './dto/update-stock-level.dto';
import { SearchStockLevelDto } from './dto/search-stock-level.dto';
import { StockLevel } from 'src/entities/stock-level/stock-level';

@Controller('stock-levels')
export class StockLevelController {
  constructor(private readonly stockLevelService: StockLevelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createStockLevelDto: CreateStockLevelDto,
  ): Promise<StockLevel> {
    try {
      return await this.stockLevelService.create(createStockLevelDto);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllStockLevels(): Promise<StockLevel[]> {
    return this.stockLevelService.getAllStockLevels();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getStockLevelById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StockLevel> {
    const stockLevel = await this.stockLevelService.getStockLevelById(id);
    if (!stockLevel) {
      throw new NotFoundException(`Stock Level with ID ${id} not found.`);
    }
    return stockLevel;
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(
    @Query() searchCriteria: SearchStockLevelDto,
  ): Promise<StockLevel[]> {
    return this.stockLevelService.search(searchCriteria);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockLevelDto: UpdateStockLevelDto,
  ): Promise<StockLevel> {
    try {
      const updatedStockLevel = await this.stockLevelService.update(
        id,
        updateStockLevelDto,
      );
      if (!updatedStockLevel) {
        throw new NotFoundException(`Stock Level with ID ${id} not found.`);
      }
      return updatedStockLevel;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleted = await this.stockLevelService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Stock Level with ID ${id} not found.`);
    }
  }
}
