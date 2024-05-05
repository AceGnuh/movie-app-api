import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'film' })
export class Film extends BaseEntity {
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
  releasedDate: Date;

  constructor(partial: Partial<Film>) {
    super();
    Object.assign(this, partial);
  }
}
