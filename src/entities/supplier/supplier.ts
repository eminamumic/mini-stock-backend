import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Location } from '../location/location';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'supplier_name',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  supplierName: string;

  @Column({ name: 'location_id', nullable: true })
  locationId: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({
    name: 'contact_person',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  contactPerson: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  jib: string;

  @Column({ name: 'pdv_number', type: 'varchar', length: 50, nullable: true })
  pdvNumber: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  note: string;
}
