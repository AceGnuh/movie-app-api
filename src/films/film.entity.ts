import { Category } from 'src/categories/category.entity';
import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Film {
  @PrimaryGeneratedColumn('uuid')
  filmId: string;

  @Column({ length: 300 })
  title: string;

  @Column('text')
  description: string;

  @Column({ default: true })
  status: boolean;

  @Column({ default: 0 })
  view: number;

  @Column({ default: 0 })
  duration: number;

  @Column({ length: 100, default: '' })
  thumbnail: string;

  @Column({ length: 100, default: '' })
  path: string;

  @Column({ default: 0 })
  order: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  releaseDate: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  modifyAt: Date;

  @ManyToOne(() => Category, (category) => category.films)
  category: Category;

  constructor(partial: Partial<Film>) {
    Object.assign(this, partial);
  }

  @BeforeUpdate()
  handleBeforeUpdate() {
    this.modifyAt = new Date();
  }
}
