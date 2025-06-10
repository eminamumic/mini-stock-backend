import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Location } from './entities/location/location';
import { Category } from './entities/category/category';
import { Product } from './entities/product/product';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '12032003',
  database: 'mini_stock',
  entities: [Location, Category, Product], // <-- AŽURIRANO: Dodaj Location
  synchronize: true, // PAŽNJA: Koristi samo za razvoj. Ne u produkciji!
  logging: false, // Postavi na true ako želiš vidjeti SQL upite u konzoli
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized successfully!');
    // Sada možeš raditi sa Location i Products entitetima
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });
