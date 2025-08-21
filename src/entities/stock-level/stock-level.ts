import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../product/product';
import { Warehouse } from '../warehouse/warehouse';

@Entity()
export class StockLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id', type: 'bigint', nullable: false })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'warehouse_id', type: 'bigint', nullable: false })
  warehouseId: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({
    name: 'current_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: false,
    default: 0,
  })
  currentQuantity: number;

  @Column({
    name: 'reorder_level',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  reorderLevel: number;

  @Column({
    name: 'reorder_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  reorderQuantity: number;

  @Column({ name: 'last_stock_take_date', type: 'date', nullable: true })
  lastStockTakeDate: Date;

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
