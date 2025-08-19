import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { StockMovement } from 'src/entities/stock-movement/stock-movement';
import { Product } from 'src/entities/product/product';
import { Employee } from 'src/entities/employee/employee';
import { Supplier } from 'src/entities/supplier/supplier';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { SearchStockMovementDto } from './dto/search-stock-movement.dto';

@Injectable()
export class StockMovementService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async createStockMovement(
    createStockMovementDto: CreateStockMovementDto,
  ): Promise<StockMovement> {
    const newMovement = this.stockMovementRepository.create(
      createStockMovementDto,
    );
    return this.stockMovementRepository.save(newMovement);
  }

  async getAllStockMovements(): Promise<StockMovement[]> {
    return this.stockMovementRepository.find({
      relations: [
        'product',
        'batch',
        'sourceWarehouse',
        'destinationWarehouse',
        'employee',
        'supplier',
      ],
    });
  }

  async getStockMovementById(id: number): Promise<StockMovement | null> {
    return this.stockMovementRepository.findOne({
      where: { id },
      relations: [
        'product',
        'batch',
        'sourceWarehouse',
        'destinationWarehouse',
        'employee',
        'supplier',
      ],
    });
  }

  async searchStockMovements(
    searchCriteria: SearchStockMovementDto,
  ): Promise<StockMovement[]> {
    const whereClause: FindOptionsWhere<StockMovement> = {};
    if (searchCriteria.id) whereClause.id = searchCriteria.id;
    if (searchCriteria.processNumber)
      whereClause.processNumber = searchCriteria.processNumber;
    if (searchCriteria.movementType)
      whereClause.movementType = Like(`%${searchCriteria.movementType}%`);
    if (searchCriteria.productId)
      whereClause.productId = searchCriteria.productId;
    if (searchCriteria.batchId) whereClause.batchId = searchCriteria.batchId;
    if (searchCriteria.sourceWarehouseId)
      whereClause.sourceWarehouseId = searchCriteria.sourceWarehouseId;
    if (searchCriteria.destinationWarehouseId)
      whereClause.destinationWarehouseId =
        searchCriteria.destinationWarehouseId;
    if (searchCriteria.employeeId)
      whereClause.employeeId = searchCriteria.employeeId;
    if (searchCriteria.supplierId)
      whereClause.supplierId = searchCriteria.supplierId;
    if (searchCriteria.referenceDocument)
      whereClause.referenceDocument = Like(
        `%${searchCriteria.referenceDocument}%`,
      );
    if (searchCriteria.note)
      whereClause.note = Like(`%${searchCriteria.note}%`);

    return this.stockMovementRepository.find({
      where: whereClause,
      relations: [
        'product',
        'batch',
        'sourceWarehouse',
        'destinationWarehouse',
        'employee',
        'supplier',
      ],
    });
  }

  async updateStockMovement(
    id: number,
    updateStockMovementDto: UpdateStockMovementDto,
  ): Promise<StockMovement | null> {
    const movementToUpdate = await this.stockMovementRepository.findOne({
      where: { id },
    });
    if (!movementToUpdate) return null;
    this.stockMovementRepository.merge(
      movementToUpdate,
      updateStockMovementDto,
    );
    return this.stockMovementRepository.save(movementToUpdate);
  }

  async deleteStockMovement(id: number): Promise<boolean> {
    const deleteResult = await this.stockMovementRepository.delete(id);
    return deleteResult.affected !== 0;
  }

  async getDistinctProducts(): Promise<Product[]> {
    const movements = await this.stockMovementRepository.find({
      relations: ['product'],
    });
    if (!movements || movements.length === 0) {
      return [];
    }
    const uniqueProducts = Array.from(
      new Set(movements.map((m) => m.product.id)),
    )
      .map((id) => movements.find((m) => m.product.id === id)?.product)
      .filter((p) => p !== undefined);
    return uniqueProducts;
  }

  async getDistinctEmployees(): Promise<Employee[]> {
    const movements = await this.stockMovementRepository.find({
      relations: ['employee'],
    });
    if (!movements || movements.length === 0) {
      return [];
    }
    const uniqueEmployees = Array.from(
      new Set(movements.map((m) => m.employee.id)),
    )
      .map((id) => movements.find((m) => m.employee.id === id)?.employee)
      .filter((e) => e !== undefined);
    return uniqueEmployees;
  }

  async getDistinctSuppliers(): Promise<Supplier[]> {
    const movements = await this.stockMovementRepository.find({
      relations: ['supplier'],
    });
    if (!movements || movements.length === 0) {
      return [];
    }
    const uniqueSuppliers = Array.from(
      new Set(movements.map((m) => m.supplier.id)),
    )
      .map((id) => movements.find((m) => m.supplier.id === id)?.supplier)
      .filter((s) => s !== undefined);
    return uniqueSuppliers;
  }

  async getDistinctMovementTypes(): Promise<string[]> {
    const movements = await this.stockMovementRepository.find();
    if (!movements || movements.length === 0) {
      return [];
    }
    return Array.from(new Set(movements.map((m) => m.movementType)));
  }

  async getDistinctMovementDates(): Promise<Date[]> {
    const movements = await this.stockMovementRepository.find();
    if (!movements || movements.length === 0) {
      return [];
    }
    const dates = movements.map(
      (m) => m.movementTimestamp.toISOString().split('T')[0],
    );
    return Array.from(new Set(dates)).map((dateStr) => new Date(dateStr));
  }

  async getDistinctProcessNumbers(): Promise<number[]> {
    const movements = await this.stockMovementRepository.find();
    if (!movements || movements.length === 0) {
      return [];
    }
    return Array.from(new Set(movements.map((m) => m.processNumber)));
  }
}
