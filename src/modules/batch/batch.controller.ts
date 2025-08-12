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
  ConflictException,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { SearchBatchDto } from './dto/search-batch.dto';
import { Batch } from 'src/entities/batch/batch';
import { Product } from 'src/entities/product/product';

@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createBatchDto: CreateBatchDto): Promise<Batch> {
    try {
      return await this.batchService.createBatch(createBatchDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error('Failed to create batch.');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Batch[]> {
    return this.batchService.getAllBatches();
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async search(@Query() searchDto: SearchBatchDto): Promise<Batch[]> {
    return this.batchService.searchBatches(searchDto);
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  async getDistinctProducts(): Promise<Product[]> {
    return this.batchService.getDistinctProductsInBatches();
  }

  @Get('expiration-dates')
  @HttpCode(HttpStatus.OK)
  async getDistinctExpirationDates(): Promise<Date[]> {
    return this.batchService.getDistinctExpirationDates();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<Batch> {
    const batch = await this.batchService.getBatchById(id);
    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found.`);
    }
    return batch;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id') id: number,
    @Body() updateBatchDto: UpdateBatchDto,
  ): Promise<Batch> {
    try {
      const updatedBatch = await this.batchService.updateBatch(
        id,
        updateBatchDto,
      );
      if (!updatedBatch) {
        throw new NotFoundException(`Batch with ID ${id} not found.`);
      }
      return updatedBatch;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error('Failed to update batch.');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    const deleted = await this.batchService.deleteBatch(id);
    if (!deleted) {
      throw new NotFoundException(`Batch with ID ${id} not found.`);
    }
  }
}
