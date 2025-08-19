import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StockMovementService } from './stock-movement.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { SearchStockMovementDto } from './dto/search-stock-movement.dto';
import { StockMovement } from 'src/entities/stock-movement/stock-movement';
import { Product } from 'src/entities/product/product';
import { Employee } from 'src/entities/employee/employee';
import { Supplier } from 'src/entities/supplier/supplier';

@Controller('stock-movements')
export class StockMovementController {
  constructor(private readonly stockMovementService: StockMovementService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Body() createStockMovementDto: CreateStockMovementDto,
  ): Promise<StockMovement> {
    return this.stockMovementService.createStockMovement(
      createStockMovementDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<StockMovement[]> {
    return this.stockMovementService.getAllStockMovements();
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async search(
    @Query() searchDto: SearchStockMovementDto,
  ): Promise<StockMovement[]> {
    return this.stockMovementService.searchStockMovements(searchDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<StockMovement> {
    const movement = await this.stockMovementService.getStockMovementById(id);
    if (!movement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found.`);
    }
    return movement;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id') id: number,
    @Body() updateStockMovementDto: UpdateStockMovementDto,
  ): Promise<StockMovement> {
    const updatedMovement = await this.stockMovementService.updateStockMovement(
      id,
      updateStockMovementDto,
    );
    if (!updatedMovement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found.`);
    }
    return updatedMovement;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    const deleted = await this.stockMovementService.deleteStockMovement(id);
    if (!deleted) {
      throw new NotFoundException(`Stock movement with ID ${id} not found.`);
    }
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  async getDistinctProducts(): Promise<Product[]> {
    return this.stockMovementService.getDistinctProducts();
  }

  @Get('employees')
  @HttpCode(HttpStatus.OK)
  async getDistinctEmployees(): Promise<Employee[]> {
    return this.stockMovementService.getDistinctEmployees();
  }

  @Get('suppliers')
  @HttpCode(HttpStatus.OK)
  async getDistinctSuppliers(): Promise<Supplier[]> {
    return this.stockMovementService.getDistinctSuppliers();
  }

  @Get('movement-types')
  @HttpCode(HttpStatus.OK)
  async getDistinctMovementTypes(): Promise<string[]> {
    return this.stockMovementService.getDistinctMovementTypes();
  }

  @Get('dates')
  @HttpCode(HttpStatus.OK)
  async getDistinctDates(): Promise<Date[]> {
    return this.stockMovementService.getDistinctMovementDates();
  }

  @Get('process-numbers')
  @HttpCode(HttpStatus.OK)
  async getDistinctProcessNumbers(): Promise<number[]> {
    return this.stockMovementService.getDistinctProcessNumbers();
  }
}
