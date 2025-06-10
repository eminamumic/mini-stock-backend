import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Product } from '../product/product';

@Entity()
export class Batch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @ManyToOne(() => Product, (product) => product.batches, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({
    name: 'serial_number',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: true,
  })
  serialNumber: string;

  @Column({
    name: 'lot_number',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: true,
  })
  lotNumber: string;

  @Column({ name: 'production_date', type: 'date', nullable: true })
  productionDate: Date;

  @Column({ name: 'expiration_date', type: 'date', nullable: true })
  expirationDate: Date;

  @Column({
    name: 'purchase_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  purchasePrice: number;

  @Column({
    name: 'sale_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  salePrice: number;

  @Column({
    name: 'batch_status',
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'Active',
  })
  batchStatus: string;

  @Column({ type: 'text', nullable: true })
  note: string;
}
