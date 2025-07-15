import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseTypeService } from './warehouse-type.service';
import { WarehouseTypeController } from './warehouse-type.controller';
import { WarehouseType } from 'src/entities/warehouse-type/warehouse-type';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseType])],
  providers: [WarehouseTypeService],
  controllers: [WarehouseTypeController],
  exports: [WarehouseTypeService],
})
export class WarehouseTypeModule {}
