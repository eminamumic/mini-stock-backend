import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, IsNull, Not } from 'typeorm';
import { StockMovement } from 'src/entities/stock-movement/stock-movement';
import { Product } from 'src/entities/product/product';
import { Batch } from 'src/entities/batch/batch';
import { Warehouse } from 'src/entities/warehouse/warehouse';
import { Employee } from 'src/entities/employee/employee';
import { Supplier } from 'src/entities/supplier/supplier';
import { StockLevel } from 'src/entities/stock-level/stock-level';
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
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(StockLevel)
    private readonly stockLevelRepository: Repository<StockLevel>,
  ) {}

  async create(
    createStockMovementDto: CreateStockMovementDto,
  ): Promise<StockMovement> {
    const existingProduct = await this.productRepository.findOne({
      where: { id: createStockMovementDto.productId },
    });
    if (!existingProduct) {
      throw new BadRequestException(
        `Product with ID ${createStockMovementDto.productId} not found.`,
      );
    }

    const existingBatch = await this.batchRepository.findOne({
      where: { id: createStockMovementDto.batchId },
    });
    if (!existingBatch) {
      throw new BadRequestException(
        `Batch with ID ${createStockMovementDto.batchId} not found.`,
      );
    }

    const existingEmployee = await this.employeeRepository.findOne({
      where: { id: createStockMovementDto.employeeId },
    });
    if (!existingEmployee) {
      throw new BadRequestException(
        `Employee with ID ${createStockMovementDto.employeeId} not found.`,
      );
    }

    if (createStockMovementDto.sourceWarehouseId) {
      const existingSourceWarehouse = await this.warehouseRepository.findOne({
        where: { id: createStockMovementDto.sourceWarehouseId },
      });
      if (!existingSourceWarehouse) {
        throw new BadRequestException(
          `Source Warehouse with ID ${createStockMovementDto.sourceWarehouseId} not found.`,
        );
      }
    }
    if (createStockMovementDto.destinationWarehouseId) {
      const existingDestinationWarehouse =
        await this.warehouseRepository.findOne({
          where: { id: createStockMovementDto.destinationWarehouseId },
        });
      if (!existingDestinationWarehouse) {
        throw new BadRequestException(
          `Destination Warehouse with ID ${createStockMovementDto.destinationWarehouseId} not found.`,
        );
      }
    }
    if (createStockMovementDto.supplierId) {
      const existingSupplier = await this.supplierRepository.findOne({
        where: { id: createStockMovementDto.supplierId },
      });
      if (!existingSupplier) {
        throw new BadRequestException(
          `Supplier with ID ${createStockMovementDto.supplierId} not found.`,
        );
      }
    }

    const newStockMovement = this.stockMovementRepository.create({
      ...createStockMovementDto,
      movementTimestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedMovement =
      await this.stockMovementRepository.save(newStockMovement);

    await this.applyMovementImpact(savedMovement);

    return savedMovement;
  }

  private async applyMovementImpact(movement: StockMovement): Promise<void> {
    const {
      movementType,
      productId,
      quantity,
      sourceWarehouseId,
      destinationWarehouseId,
      batchId,
    } = movement;

    switch (movementType) {
      case 'In':
        if (!destinationWarehouseId) {
          throw new BadRequestException(
            'Destination warehouse ID is required for "In" movement.',
          );
        }
        await this.updateStockLevel(
          productId,
          destinationWarehouseId,
          quantity,
          'add',
        );
        await this.updateBatchQuantity(batchId, quantity, 'add');
        break;
      case 'Out':
        if (!sourceWarehouseId) {
          throw new BadRequestException(
            'Source warehouse ID is required for "Out" movement.',
          );
        }
        await this.updateStockLevel(
          productId,
          sourceWarehouseId,
          quantity,
          'subtract',
        );
        await this.updateBatchQuantity(batchId, quantity, 'subtract');
        break;
      case 'Transfer':
        if (!sourceWarehouseId || !destinationWarehouseId) {
          throw new BadRequestException(
            'Both source and destination warehouse IDs are required for "Transfer" movement.',
          );
        }
        await this.updateStockLevel(
          productId,
          sourceWarehouseId,
          quantity,
          'subtract',
        );
        await this.updateStockLevel(
          productId,
          destinationWarehouseId,
          quantity,
          'add',
        );

        break;
      case 'Prerada':
        if (sourceWarehouseId && !destinationWarehouseId) {
          await this.updateStockLevel(
            productId,
            sourceWarehouseId,
            quantity,
            'subtract',
          );
          await this.updateBatchQuantity(batchId, quantity, 'subtract');
        } else if (!sourceWarehouseId && destinationWarehouseId) {
          await this.updateStockLevel(
            productId,
            destinationWarehouseId,
            quantity,
            'add',
          );
          await this.updateBatchQuantity(batchId, quantity, 'add');
        } else {
          throw new BadRequestException(
            'For "Prerada" movement, exactly one of sourceWarehouseId or destinationWarehouseId must be provided.',
          );
        }
        break;
      default:
        console.warn(
          `Unhandled movement type: ${movementType}. StockLevel and Batch quantity not updated.`,
        );
        break;
    }
  }

  private async reverseMovementImpact(movement: StockMovement): Promise<void> {
    const {
      movementType,
      productId,
      quantity,
      sourceWarehouseId,
      destinationWarehouseId,
      batchId,
    } = movement;

    try {
      switch (movementType) {
        case 'In':
          if (destinationWarehouseId) {
            await this.updateStockLevel(
              productId,
              destinationWarehouseId,
              quantity,
              'subtract',
            );
            await this.updateBatchQuantity(batchId, quantity, 'subtract');
          }
          break;
        case 'Out':
          if (sourceWarehouseId) {
            await this.updateStockLevel(
              productId,
              sourceWarehouseId,
              quantity,
              'add',
            );
            await this.updateBatchQuantity(batchId, quantity, 'add');
          }
          break;
        case 'Transfer':
          if (sourceWarehouseId) {
            await this.updateStockLevel(
              productId,
              sourceWarehouseId,
              quantity,
              'add',
            );
          }
          if (destinationWarehouseId) {
            await this.updateStockLevel(
              productId,
              destinationWarehouseId,
              quantity,
              'subtract',
            );
          }

          break;
        case 'Prerada':
          if (sourceWarehouseId && !destinationWarehouseId) {
            await this.updateStockLevel(
              productId,
              sourceWarehouseId,
              quantity,
              'add',
            );
            await this.updateBatchQuantity(batchId, quantity, 'add');
          } else if (!sourceWarehouseId && destinationWarehouseId) {
            await this.updateStockLevel(
              productId,
              destinationWarehouseId,
              quantity,
              'subtract',
            );
            await this.updateBatchQuantity(batchId, quantity, 'subtract');
          }
          break;
        default:
          console.warn(
            `Unhandled movement type on reversal: ${movementType}. StockLevel and Batch quantity might need manual adjustment.`,
          );
          break;
      }
    } catch (error) {
      throw new BadRequestException(
        `Failed to adjust stock levels or batch quantities during reversal: ${error}`,
      );
    }
  }

  private async updateStockLevel(
    productId: number,
    warehouseId: number,
    quantity: number,
    operation: 'add' | 'subtract',
  ): Promise<void> {
    let stockLevel = await this.stockLevelRepository.findOne({
      where: { productId, warehouseId },
    });

    if (!stockLevel) {
      if (operation === 'subtract') {
        throw new BadRequestException(
          `Cannot subtract. Stock level for Product ID ${productId} in Warehouse ID ${warehouseId} does not exist.`,
        );
      }
      stockLevel = this.stockLevelRepository.create({
        productId,
        warehouseId,
        currentQuantity: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const currentQty = parseFloat(stockLevel.currentQuantity as any);
    const qtyToAdjust = parseFloat(quantity as any);

    if (operation === 'add') {
      stockLevel.currentQuantity = currentQty + qtyToAdjust;
    } else {
      if (currentQty < qtyToAdjust) {
        throw new BadRequestException(
          `Insufficient stock for Product ID ${productId} in Warehouse ID ${warehouseId}. Available: ${currentQty}, Requested: ${qtyToAdjust}.`,
        );
      }
      stockLevel.currentQuantity = currentQty - qtyToAdjust;
    }
    stockLevel.updatedAt = new Date();
    await this.stockLevelRepository.save(stockLevel);
  }

  private async updateBatchQuantity(
    batchId: number,
    quantity: number,
    operation: 'add' | 'subtract',
  ): Promise<void> {
    let batch = await this.batchRepository.findOne({
      where: { id: batchId },
    });

    if (!batch) {
      throw new BadRequestException(`Batch with ID ${batchId} not found.`);
    }

    const currentBatchQty = parseFloat(batch.currentQuantity as any);
    const qtyToAdjust = parseFloat(quantity as any);

    if (operation === 'add') {
      batch.currentQuantity = currentBatchQty + qtyToAdjust;
    } else {
      // subtract
      if (currentBatchQty < qtyToAdjust) {
        throw new BadRequestException(
          `Insufficient quantity in Batch ID ${batchId}. Available: ${currentBatchQty}, Requested: ${qtyToAdjust}.`,
        );
      }
      batch.currentQuantity = currentBatchQty - qtyToAdjust;
    }
    batch.updatedAt = new Date();
    await this.batchRepository.save(batch);
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

  async search(
    searchCriteria: SearchStockMovementDto,
  ): Promise<StockMovement[]> {
    const whereClause: FindOptionsWhere<StockMovement> = {};

    if (searchCriteria.id) {
      whereClause.id = searchCriteria.id;
    }
    if (searchCriteria.processNumber) {
      whereClause.processNumber = searchCriteria.processNumber;
    }
    if (searchCriteria.movementTimestamp) {
      whereClause.movementTimestamp = new Date(
        searchCriteria.movementTimestamp,
      );
    }
    if (searchCriteria.movementType) {
      whereClause.movementType = Like(`%${searchCriteria.movementType}%`);
    }
    if (searchCriteria.productId) {
      whereClause.productId = searchCriteria.productId;
    }
    if (searchCriteria.batchId) {
      whereClause.batchId = searchCriteria.batchId;
    }
    if (searchCriteria.quantity) {
      whereClause.quantity = searchCriteria.quantity;
    }
    if (searchCriteria.sourceWarehouseId) {
      whereClause.sourceWarehouseId = searchCriteria.sourceWarehouseId;
    }
    if (searchCriteria.destinationWarehouseId) {
      whereClause.destinationWarehouseId =
        searchCriteria.destinationWarehouseId;
    }
    if (searchCriteria.employeeId) {
      whereClause.employeeId = searchCriteria.employeeId;
    }
    if (searchCriteria.supplierId) {
      whereClause.supplierId = searchCriteria.supplierId;
    }
    if (searchCriteria.referenceDocument) {
      whereClause.referenceDocument = Like(
        `%${searchCriteria.referenceDocument}%`,
      );
    }
    if (searchCriteria.note) {
      whereClause.note = Like(`%${searchCriteria.note}%`);
    }

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

  async update(
    id: number,
    updateStockMovementDto: UpdateStockMovementDto,
  ): Promise<StockMovement | null> {
    const stockMovementToUpdate = await this.stockMovementRepository.findOne({
      where: { id },
    });

    if (!stockMovementToUpdate) {
      return null;
    }

    const oldMovementState: StockMovement = { ...stockMovementToUpdate };

    this.stockMovementRepository.merge(stockMovementToUpdate, {
      ...updateStockMovementDto,
      updatedAt: new Date(),
    });

    try {
      await this.reverseMovementImpact(oldMovementState);

      const updatedMovement = await this.stockMovementRepository.save(
        stockMovementToUpdate,
      );

      await this.applyMovementImpact(updatedMovement);

      return updatedMovement;
    } catch (error) {
      console.error(
        `Error updating StockMovement ID ${id} and adjusting StockLevels/Batch quantities:`,
        error,
      );
      throw new BadRequestException(
        `Failed to update movement and adjust stock levels/batch quantities: ${error}`,
      );
    }
  }

  async delete(id: number): Promise<boolean> {
    const movementToDelete = await this.stockMovementRepository.findOne({
      where: { id },
    });

    if (!movementToDelete) {
      return false;
    }

    try {
      await this.reverseMovementImpact(movementToDelete);
    } catch (error) {
      console.error(
        `Failed to reverse StockLevel/Batch quantity for movement ID ${id} on delete:`,
        error,
      );
      throw new BadRequestException(
        `Failed to adjust stock levels/batch quantities upon deleting movement: ${error}`,
      );
    }

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
      where: { supplierId: Not(IsNull()) },
    });
    if (!movements || movements.length === 0) {
      return [];
    }
    const uniqueSuppliers = Array.from(
      new Set(movements.map((m) => m.supplier?.id)),
    )
      .filter((id) => id !== undefined)
      .map((id) => movements.find((m) => m.supplier?.id === id)?.supplier)
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
    const movements = await this.stockMovementRepository.find({
      where: { processNumber: Not(IsNull()) },
    });
    if (!movements || movements.length === 0) {
      return [];
    }
    const distinctNumbers = Array.from(
      new Set(movements.map((m) => m.processNumber)),
    ).filter((n) => n !== null);
    return distinctNumbers;
  }
}
