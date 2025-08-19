import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('MiniStock API')
    .setDescription(
      'API for managing inventory, stock levels, and related operations in the MiniStock application.',
    )
    .setVersion('1.0')
    .addTag('users', 'Operations related to user accounts')
    .addTag('employees', 'Operations related to employees')
    .addTag('products', 'Operations related to products')
    .addTag('categories', 'Operations related to product categories')
    .addTag('batches', 'Operations related to product batches')
    .addTag(
      'stock-levels',
      'Operations related to product stock levels in warehouses',
    )
    .addTag(
      'stock-movements',
      'Operations related to stock movements (in, out, transfer)',
    )
    .addTag('suppliers', 'Operations related to suppliers')
    .addTag('warehouses', 'Operations related to warehouses')
    .addTag(
      'warehouse-access',
      'Operations related to employee access to warehouses',
    )
    .addTag('warehouse-types', 'Operations related to types of warehouses')
    .addTag('locations', 'Operations related to locations')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger UI available at: ${await app.getUrl()}/api`);
}
bootstrap();
