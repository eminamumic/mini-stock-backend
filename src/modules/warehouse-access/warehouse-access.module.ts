import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseAccessService } from './warehouse-access.service';
import { WarehouseAccessController } from './warehouse-access.controller';
import { WarehouseAccess } from 'src/entities/warehouse-access/warehouse-access';
import { Employee } from 'src/entities/employee/employee';
import { Warehouse } from 'src/entities/warehouse/warehouse';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseAccess, Employee, Warehouse])],
  providers: [WarehouseAccessService],
  controllers: [WarehouseAccessController],
  exports: [WarehouseAccessService],
})
export class WarehouseAccessModule {}
