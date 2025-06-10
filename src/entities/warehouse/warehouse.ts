import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Location } from '../location/location';
import { WarehouseType } from '../warehouse-type/warehouse-type';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;

  @Column({
    name: 'location_id',
    type: 'bigint',
    nullable: true,
    unique: false,
  })
  locationId: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ name: 'warehouse_type_id', nullable: true })
  warehouseTypeId: number;

  @ManyToOne(() => WarehouseType)
  @JoinColumn({ name: 'warehouse_type_id' })
  warehouseType: WarehouseType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: Date;

  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;
}
