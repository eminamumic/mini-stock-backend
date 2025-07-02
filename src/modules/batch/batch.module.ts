import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { Batch } from 'src/entities/batch/batch';
import { Product } from 'src/entities/product/product';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, Product])],
  controllers: [BatchController],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
