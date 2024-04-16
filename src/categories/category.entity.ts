import { Film } from 'src/films/film.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({ length: 300 })
  name: string;

  @Column()
  status: boolean;

  @Column()
  order: number;

  @OneToMany(() => Film, (film) => film.category, {
    eager: false,
  })
  films: Film[];

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
