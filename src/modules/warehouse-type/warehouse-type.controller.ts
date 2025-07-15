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
  ConflictException,
  ParseIntPipe,
} from '@nestjs/common';
import { WarehouseTypeService } from './warehouse-type.service';
import { CreateWarehouseTypeDto } from './dto/create-warehouse-type.dto';
import { UpdateWarehouseTypeDto } from './dto/update-warehouse-type.dto';
import { SearchWarehouseTypeDto } from './dto/search-warehouse-type.dto';
import { WarehouseType } from 'src/entities/warehouse-type/warehouse-type';

@Controller('warehouse-types')
export class WarehouseTypeController {
  constructor(private readonly warehouseTypeService: WarehouseTypeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createWarehouseTypeDto: CreateWarehouseTypeDto,
  ): Promise<WarehouseType> {
    try {
      return await this.warehouseTypeService.create(createWarehouseTypeDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllWarehouseTypes(): Promise<WarehouseType[]> {
    return this.warehouseTypeService.getAllWarehouseTypes();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getWarehouseTypeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WarehouseType> {
    const warehouseType =
      await this.warehouseTypeService.getWarehouseTypeById(id);
    if (!warehouseType) {
      throw new NotFoundException(`Warehouse Type with ID ${id} not found.`);
    }
    return warehouseType;
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(
    @Query() searchCriteria: SearchWarehouseTypeDto,
  ): Promise<WarehouseType[]> {
    return this.warehouseTypeService.search(searchCriteria);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseTypeDto: UpdateWarehouseTypeDto,
  ): Promise<WarehouseType> {
    try {
      const updatedWarehouseType = await this.warehouseTypeService.update(
        id,
        updateWarehouseTypeDto,
      );
      if (!updatedWarehouseType) {
        throw new NotFoundException(`Warehouse Type with ID ${id} not found.`);
      }
      return updatedWarehouseType;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleted = await this.warehouseTypeService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Warehouse Type with ID ${id} not found.`);
    }
  }
}
