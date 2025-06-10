import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Category } from '../category/category';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'product_code',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  productCode: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'unit_of_measure',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  unitOfMeasure: string;

  @Column({
    name: 'min_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  minQuantity: number;

  @Column({
    name: 'unit_weight',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  unitWeight: number;

  @Column({
    name: 'storage_temp_min',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  storageTempMin: number;

  @Column({
    name: 'storage_temp_max',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  storageTempMax: number;

  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'last_updated_at',
    type: 'timestamp',
    nullable: false,
  })
  lastUpdatedAt: Date;
}
