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
import { WarehouseAccessService } from './warehouse-access.service';
import { CreateWarehouseAccessDto } from './dto/create-warehouse-access.dto';
import { UpdateWarehouseAccessDto } from './dto/update-warehouse-access.dto';
import { SearchWarehouseAccessDto } from './dto/search-warehouse-access.dto';
import { WarehouseAccess } from 'src/entities/warehouse-access/warehouse-access';
import { Warehouse } from 'src/entities/warehouse/warehouse';
import { Employee } from 'src/entities/employee/employee';

@Controller('warehouse-access')
export class WarehouseAccessController {
  constructor(
    private readonly warehouseAccessService: WarehouseAccessService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createWarehouseAccessDto: CreateWarehouseAccessDto,
  ): Promise<WarehouseAccess> {
    try {
      return await this.warehouseAccessService.create(createWarehouseAccessDto);
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
  async getAllWarehouseAccess(): Promise<WarehouseAccess[]> {
    return this.warehouseAccessService.getAllWarehouseAccess();
  }
  @Get('employees')
  @HttpCode(HttpStatus.OK)
  async getDistinctEmployees(): Promise<Employee[]> {
    return this.warehouseAccessService.getDistinctEmployeesWithAccess();
  }

  @Get('warehouses')
  @HttpCode(HttpStatus.OK)
  async getDistinctWarehouses(): Promise<Warehouse[]> {
    return this.warehouseAccessService.getDistinctWarehousesWithAccess();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getWarehouseAccessById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WarehouseAccess> {
    const warehouseAccess =
      await this.warehouseAccessService.getWarehouseAccessById(id);
    if (!warehouseAccess) {
      throw new NotFoundException(`Warehouse Access with ID ${id} not found.`);
    }
    return warehouseAccess;
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(
    @Query() searchCriteria: SearchWarehouseAccessDto,
  ): Promise<WarehouseAccess[]> {
    return this.warehouseAccessService.search(searchCriteria);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseAccessDto: UpdateWarehouseAccessDto,
  ): Promise<WarehouseAccess> {
    try {
      const updatedWarehouseAccess = await this.warehouseAccessService.update(
        id,
        updateWarehouseAccessDto,
      );
      if (!updatedWarehouseAccess) {
        throw new NotFoundException(
          `Warehouse Access with ID ${id} not found.`,
        );
      }
      return updatedWarehouseAccess;
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
    const deleted = await this.warehouseAccessService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Warehouse Access with ID ${id} not found.`);
    }
  }
}
