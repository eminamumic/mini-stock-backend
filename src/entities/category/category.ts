import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'parent_category_id', type: 'bigint', nullable: true })
  parentCategoryId: number;

  @Column({ name: 'hierarchy_level', type: 'int', nullable: false, default: 1 })
  hierarchyLevel: number;

  @Column({
    name: 'category_type',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  categoryType: string;

  @ManyToOne(() => Category, (category) => category.children, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_category_id' })
  parentCategory: Category;
  @OneToMany(() => Category, (category) => category.parentCategory)
  children: Category[];
}
