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
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SearchSupplierDto } from './dto/search-supplier.dto';
import { Supplier } from 'src/entities/supplier/supplier';
import { Location } from 'src/entities/location/location';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<Supplier> {
    try {
      return await this.supplierService.create(createSupplierDto);
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
  async getAllSuppliers(): Promise<Supplier[]> {
    return this.supplierService.getAllSuppliers();
  }

  @Get('locations')
  @HttpCode(HttpStatus.OK)
  async getDistinctLocations(): Promise<Location[]> {
    return this.supplierService.getDistinctLocations();
  }

  @Get('active-statuses')
  @HttpCode(HttpStatus.OK)
  async getDistinctActiveStatuses(): Promise<boolean[]> {
    return this.supplierService.getDistinctActiveStatuses();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getSupplierById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Supplier> {
    const supplier = await this.supplierService.getSupplierById(id);
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found.`);
    }
    return supplier;
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(
    @Query() searchCriteria: SearchSupplierDto,
  ): Promise<Supplier[]> {
    return this.supplierService.search(searchCriteria);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    try {
      const updatedSupplier = await this.supplierService.update(
        id,
        updateSupplierDto,
      );
      if (!updatedSupplier) {
        throw new NotFoundException(`Supplier with ID ${id} not found.`);
      }
      return updatedSupplier;
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
    const deleted = await this.supplierService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Supplier with ID ${id} not found.`);
    }
  }
}
