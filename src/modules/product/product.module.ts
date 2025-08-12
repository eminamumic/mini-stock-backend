import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from 'src/entities/product/product';
import { Category } from 'src/entities/category/category';
import { Supplier } from 'src/entities/supplier/supplier';
import { Warehouse } from 'src/entities/warehouse/warehouse';
@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Supplier, Warehouse])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
