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
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { SearchWarehouseDto } from './dto/search-warehouse.dto';
import { Warehouse } from 'src/entities/warehouse/warehouse';
import { Location } from 'src/entities/location/location';
import { WarehouseType } from 'src/entities/warehouse-type/warehouse-type';

@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createWarehouseDto: CreateWarehouseDto,
  ): Promise<Warehouse> {
    try {
      return await this.warehouseService.create(createWarehouseDto);
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
  async getAllWarehouses(): Promise<Warehouse[]> {
    return this.warehouseService.getAllWarehouses();
  }

  @Get('locations')
  @HttpCode(HttpStatus.OK)
  async getDistinctLocations(): Promise<Location[]> {
    return this.warehouseService.getDistinctLocations();
  }

  @Get('warehouse-types')
  @HttpCode(HttpStatus.OK)
  async getDistinctWarehouseTypes(): Promise<WarehouseType[]> {
    return this.warehouseService.getDistinctWarehouseTypes();
  }

  @Get('is-active')
  @HttpCode(HttpStatus.OK)
  async getDistinctIsActive(): Promise<boolean[]> {
    return this.warehouseService.getDistinctIsActive();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getWarehouseById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Warehouse> {
    const warehouse = await this.warehouseService.getWarehouseById(id);
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found.`);
    }
    return warehouse;
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(
    @Query() searchCriteria: SearchWarehouseDto,
  ): Promise<Warehouse[]> {
    return this.warehouseService.search(searchCriteria);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    try {
      const updatedWarehouse = await this.warehouseService.update(
        id,
        updateWarehouseDto,
      );
      if (!updatedWarehouse) {
        throw new NotFoundException(`Warehouse with ID ${id} not found.`);
      }
      return updatedWarehouse;
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
    const deleted = await this.warehouseService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Skladište s ID-em ${id} nije pronađeno.`);
    }
  }
}
