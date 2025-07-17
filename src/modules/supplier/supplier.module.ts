import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from 'src/entities/supplier/supplier';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { Location } from 'src/entities/location/location';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Location])],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierModule {}
