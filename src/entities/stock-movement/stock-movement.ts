import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Product } from '../product/product';
import { Batch } from '../batch/batch';
import { Warehouse } from '../warehouse/warehouse';
import { Employee } from '../employee/employee';
import { Supplier } from '../supplier/supplier';

@Entity()
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'process_number', type: 'bigint', nullable: true })
  processNumber: number;

  @CreateDateColumn({
    name: 'movement_timestamp',
    type: 'timestamp',
    nullable: false,
  })
  movementTimestamp: Date;

  @Column({
    name: 'movement_type',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  movementType: string;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'batch_id', nullable: false })
  batchId: number;

  @ManyToOne(() => Batch)
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ type: 'decimal', precision: 18, scale: 4, nullable: false })
  quantity: number;

  @Column({ name: 'source_warehouse_id', nullable: true })
  sourceWarehouseId: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'source_warehouse_id' })
  sourceWarehouse: Warehouse;

  @Column({ name: 'destination_warehouse_id', nullable: true })
  destinationWarehouseId: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'destination_warehouse_id' })
  destinationWarehouse: Warehouse;

  @Column({ name: 'employee_id', nullable: false })
  employeeId: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'supplier_id', nullable: true })
  supplierId: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({
    name: 'reference_document',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  referenceDocument: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
