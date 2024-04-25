import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'film' })
export class Film {
  @PrimaryGeneratedColumn('uuid', { name: 'film_id' })
  filmId: string;

  @Column({ length: 300 })
  title: string;

  @Column('text')
  description: string;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'int8', default: 0 })
  view: number;

  @Column({ default: 0 })
  duration: number;

  @Column({ length: 100, default: '' })
  thumbnail: string;

  @Column({ length: 100, default: '' })
  path: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: 'Unknown' })
  director: string;

  @Column({
    name: 'release_date',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  releaseDate: Date;

  @CreateDateColumn({ name: 'create_at', type: 'timestamp with time zone' })
  createAt: Date;

  @UpdateDateColumn({ name: 'modify_at', type: 'timestamp with time zone' })
  modifyAt: Date;

  @DeleteDateColumn({ name: 'delete_at', type: 'timestamp with time zone' })
  deleteAt: Date;

  constructor(partial: Partial<Film>) {
    Object.assign(this, partial);
  }
}
