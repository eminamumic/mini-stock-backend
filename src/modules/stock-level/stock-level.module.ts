import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockLevel } from 'src/entities/stock-level/stock-level';
import { StockLevelController } from './stock-level.sontroller';
import { StockLevelService } from './stock-level.service';
import { Product } from 'src/entities/product/product';
import { Warehouse } from 'src/entities/warehouse/warehouse';

@Module({
  imports: [TypeOrmModule.forFeature([StockLevel, Product, Warehouse])],
  controllers: [StockLevelController],
  providers: [StockLevelService],
  exports: [StockLevelService],
})
export class StockLevelModule {}
