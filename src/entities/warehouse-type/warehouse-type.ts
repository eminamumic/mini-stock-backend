import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WarehouseType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'type_name',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  typeName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'requires_temp_control',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  requiresTempControl: boolean;

  @Column({
    name: 'min_temperature_c',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  minTemperatureC: number;

  @Column({
    name: 'max_temperature_c',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  maxTemperatureC: number;
}
