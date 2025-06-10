import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Warehouse } from '../warehouse/warehouse';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  state: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zipCode: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @ManyToOne(() => Warehouse)
  warehouse: Warehouse[];
}
