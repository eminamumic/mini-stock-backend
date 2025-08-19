# MiniStock Backend API

This repository contains the backend component of the "MiniStock" application, a robust and scalable solution for inventory management, goods movement tracking, and warehouse organization. It is developed with a focus on modularity, performance, and reliability, using modern technologies and best practices.

---

## 🎯 Project Goal

The main goal of this project is to provide a reliable and highly functional API service that supports complex inventory management operations. This includes:
- Creating and managing entities such as products, warehouses, and suppliers.
- Detailed tracking of goods movements (inbound, outbound, transfers) with references to documents and processes.
- Efficient data searching and filtering to provide users with quick access to information.
- Maintaining data consistency through strict relational integrity and validation.

## 🛠️ Technology Stack

The backend is built on a foundation of modern and efficient technologies:
- **NestJS**: A progressive Node.js framework for building scalable server-side applications, built on TypeScript.
- **TypeScript**: A programming language that brings static typing, which significantly improves code quality and maintainability.
- **TypeORM**: A powerful ORM (Object-Relational Mapper) that allows for elegant database interaction, reducing the need for raw SQL queries.
- **MySQL**: A robust relational database that ensures data consistency, integrity, and persistence.
- **Swagger/OpenAPI**: Used for automatically generating interactive API documentation, facilitating testing and integration.

## 📂 Project Architecture

The project is organized using a modular architecture, where each key domain (`StockMovement`, `Warehouse`, `Product`, etc.) has its own dedicated module. This structure enables:
- **Clear Separation of Concerns**: Each module has its own `Controller`, `Service`, and `Module`, which isolates business logic and makes the codebase easier to navigate.
- **Simple Maintenance**: Modifications within one domain do not directly affect other parts of the system.
- **Scalability**: It's easier to add new functionalities and entities without compromising the existing structure.

---

## 📊 Schemas (DTOs)

Each entity has defined schemas (DTOs) that ensure a proper data structure for API operations.

- `Create...Dto`: Schema for creating a new record.
- `Update...Dto`: Schema for updating an existing record.
- `Search...Dto`: Schema for sending search criteria.

---

## 🚀 API Endpoints

All API endpoints are organized by entity and are accessible via standard HTTP methods.

### **Stock Movements**
Operations related to stock movements (inbound, outbound, transfer).
- `POST /stock-movements` - Creates a new stock movement.
- `GET /stock-movements` - Retrieves all stock movements.
- `GET /stock-movements/search` - Searches for stock movements based on various criteria.
- `GET /stock-movements/products` - Retrieves unique products from stock movements for filtering.
- `GET /stock-movements/employees` - Retrieves unique employees from stock movements for filtering.
- `GET /stock-movements/suppliers` - Retrieves unique suppliers from stock movement records for filtering.
- `GET /stock-movements/movement-types` - Retrieves unique movement types.
- `GET /stock-movements/dates` - Retrieves unique movement dates.
- `GET /stock-movements/process-numbers` - Retrieves unique process numbers.
- `GET /stock-movements/{id}` - Retrieves a single stock movement by ID.
- `PUT /stock-movements/{id}` - Updates a stock movement by ID.
- `DELETE /stock-movements/{id}` - Deletes a stock movement by ID.

### **Warehouses**
Operations related to warehouses.
- `POST /warehouses` - Creates a new warehouse.
- `GET /warehouses` - Retrieves all warehouses.
- `GET /warehouses/search` - Searches for warehouses.
- `GET /warehouses/locations` - Retrieves unique warehouse locations for filtering.
- `GET /warehouses/warehouse-types` - Retrieves unique warehouse types for filtering.
- `GET /warehouses/is-active` - Retrieves unique active statuses (`true`/`false`).
- `GET /warehouses/{id}` - Retrieves a single warehouse by ID.
- `PUT /warehouses/{id}` - Updates a warehouse by ID.
- `DELETE /warehouses/{id}` - Deletes a warehouse by ID.

### **Products**
Operations related to products.
- `POST /products` - Creates a new product.
- `GET /products` - Retrieves all products.
- `GET /products/search` - Searches for products.
- `GET /products/categories` - Retrieves unique product categories for filtering.
- `GET /products/suppliers` - Retrieves unique product suppliers for filtering.
- `GET /products/warehouses` - Retrieves unique warehouses containing products.
- `GET /products/{id}` - Retrieves a single product by ID.
- `PUT /products/{id}` - Updates a product by ID.
- `DELETE /products/{id}` - Deletes a product by ID.

### **Categories**
Operations related to product categories.
- `POST /categories` - Creates a new category.
- `GET /categories` - Retrieves all categories.
- `GET /categories/search` - Searches for categories.
- `GET /categories/paren-categories` - Retrieves unique parent categories.
- `GET /categories/hierarchy-levels` - Retrieves unique hierarchy levels.
- `GET /categories/category-types` - Retrieves unique category types.
- `GET /categories/{id}` - Retrieves a single category by ID.
- `PUT /categories/{id}` - Updates a category by ID.
- `DELETE /categories/{id}` - Deletes a category by ID.

### **Batches**
Operations related to product batches.
- `POST /batches` - Creates a new batch.
- `GET /batches` - Retrieves all batches.
- `GET /batches/search` - Searches for batches.
- `GET /batches/products` - Retrieves unique products from batches.
- `GET /batches/expiration-dates` - Retrieves unique expiration dates.
- `GET /batches/sort-by-quantity` - Retrieves batches sorted by quantity.
- `GET /batches/with-relations` - Retrieves batches with related entities.
- `GET /batches/{id}` - Retrieves a single batch by ID.
- `PUT /batches/{id}` - Updates a batch by ID.
- `DELETE /batches/{id}` - Deletes a batch by ID.

### **Stock Levels**
Operations related to stock levels.
- `POST /stock-levels` - Creates a new stock level.
- `GET /stock-levels` - Retrieves all stock levels.
- `GET /stock-levels/search` - Searches for stock levels.
- `GET /stock-levels/distinct/products` - Retrieves unique products from stock levels.
- `GET /stock-levels/distinct/warehouses` - Retrieves unique warehouses from stock levels.
- `GET /stock-levels/{id}` - Retrieves a single stock level by ID.
- `PUT /stock-levels/{id}` - Updates a stock level by ID.
- `DELETE /stock-levels/{id}` - Deletes a stock level by ID.

### **Other Entities**

- **Users**: `/users`
- **Employees**: `/employees`
- **Suppliers**: `/suppliers`
- **Warehouse Types**: `/warehouse-types`
- **Locations**: `/locations`
- **Warehouse Access**: `/warehouse-access`

---

### Project Structure:

```bash
/src
├── entities/                   # Database entity definitions with TypeORM annotations
├── modules/                    # Main application modules (e.g., stock-movement, warehouse)
│   ├── stock-movement/         # Module for stock movement operations
│   │   ├── dto/                # Data Transfer Objects (DTOs) for validation
│   │   ├── stock-movement.controller.ts  # Layer for handling HTTP requests
│   │   ├── stock-movement.service.ts     # Layer for business logic and database interaction
│   │   └── stock-movement.module.ts      # Module configuration
│   └── warehouse/              # Module for warehouse management
│       └── ...
├── app.module.ts               # Main module that connects all other modules
├── main.ts                     # Application entry point and service configuration (e.g., Swagger)
└── ...
