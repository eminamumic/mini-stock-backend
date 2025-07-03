import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockLevel } from 'src/entities/stock-level/stock-level';
import { StockLevelController } from './stock-level.sontroller';
import { StockLevelService } from './stock-level.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockLevel])],
  controllers: [StockLevelController],
  providers: [StockLevelService],
  exports: [StockLevelService],
})
export class StockLevelModule {}
