import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Location } from './entities/location/location';
import { Category } from './entities/category/category';
import { Product } from './entities/product/product';
import { WarehouseTipe } from './entities/warehouse-tipe/warehouse-tipe';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '12032003',
  database: 'mini_stock',
  entities: [Location, Category, Product, WarehouseTipe],
  synchronize: true,
  logging: false,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized successfully!');
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });
