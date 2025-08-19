import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementService } from './stock-movement.service';
import { StockMovementController } from './stock-movement.controller';
import { StockMovement } from 'src/entities/stock-movement/stock-movement';
import { Product } from 'src/entities/product/product';
import { Employee } from 'src/entities/employee/employee';
import { Supplier } from 'src/entities/supplier/supplier';
import { Batch } from 'src/entities/batch/batch';
import { Warehouse } from 'src/entities/warehouse/warehouse';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockMovement,
      Product,
      Employee,
      Supplier,
      Batch,
      Warehouse,
    ]),
  ],
  controllers: [StockMovementController],
  providers: [StockMovementService],
  exports: [StockMovementService],
})
export class StockMovementModule {}
