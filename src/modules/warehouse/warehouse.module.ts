import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { Warehouse } from 'src/entities/warehouse/warehouse';
import { Location } from 'src/entities/location/location';
import { WarehouseType } from 'src/entities/warehouse-type/warehouse-type';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, Location, WarehouseType])],
  providers: [WarehouseService],
  controllers: [WarehouseController],
  exports: [WarehouseService],
})
export class WarehouseModule {}
