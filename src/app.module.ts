import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Location } from './entities/location/location';
import { Category } from './entities/category/category';
import { Product } from './entities/product/product';
import { Warehouse } from './entities/warehouse/warehouse';
import { WarehouseType } from './entities/warehouse-type/warehouse-type';
import { Batch } from './entities/batch/batch';
import { StockLevel } from './entities/stock-level/stock-level';
import { User } from './entities/user/user';
import { Employee } from './entities/employee/employee';
import { WarehouseAccess } from './entities/warehouse-access/warehouse-access';
import { Supplier } from './entities/supplier/supplier';
import { StockMovement } from './entities/stock-movement/stock-movement';
import { LocationModule } from './modules/location/location.module';
import { CategoryModule } from './modules/category/category.module';
import { BatchModule } from './modules/batch/batch.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { StockLevelModule } from './modules/stock-level/stock-level.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { WarehouseAccessModule } from './modules/warehouse-access/warehouse-access.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12032003',
      database: 'mini_stock',
      entities: [
        Product,
        Location,
        Category,
        WarehouseType,
        Warehouse,
        Batch,
        StockLevel,
        User,
        Employee,
        WarehouseAccess,
        Supplier,
        StockMovement,
      ],
      synchronize: false,
      logging: ['query', 'error'],
    }),
    LocationModule,
    CategoryModule,
    BatchModule,
    ProductModule,
    UserModule,
    EmployeeModule,
    StockLevelModule,
    SupplierModule,
    WarehouseModule,
    WarehouseAccessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
