import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';

import { Employee } from '../employee/employee';
import { Warehouse } from '../warehouse/warehouse';

@Entity()
@Unique(['employee', 'warehouse'])
export class WarehouseAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id', nullable: false })
  employeeId: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'warehouse_id', nullable: false })
  warehouseId: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'assignment_date',
    type: 'timestamp',
    nullable: false,
  })
  assignmentDate: Date;

  @Column({ name: 'revocation_date', type: 'timestamp', nullable: true })
  revocationDate: Date;
}
