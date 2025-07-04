import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Location } from './entities/location/location';
import { Category } from './entities/category/category';
import { Product } from './entities/product/product';
import { WarehouseType } from './entities/warehouse-type/warehouse-type';
import { Warehouse } from './entities/warehouse/warehouse';
import { Batch } from './entities/batch/batch';
import { StockLevel } from './entities/stock-level/stock-level';
import { User } from './entities/user/user';
import { Employee } from './entities/employee/employee';
import { WarehouseAccess } from './entities/warehouse-access/warehouse-access';
import { Supplier } from './entities/supplier/supplier';
import { StockMovement } from './entities/stock-movement/stock-movement';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'mini_stock',
  entities: [
    Location,
    Category,
    Product,
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
  migrations: ['./migrations/*.ts'],

  logging: 'all',
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized successfully!');
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });
