import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDTO } from 'src/categories/dto/create-category.dto';
import { UpdateCategoryDTO } from 'src/categories/dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      relations: ['films'],
      where: {
        status: true,
      },
      order: {
        order: 'DESC',
      },
    });

    // Remove films that are not active in category
    categories.forEach((category) => {
      category.films = category.films.filter((film) => film.status);
    });

    return categories;
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      relations: ['films'],
      where: {
        categoryId: id,
        status: true,
      },
    });

    // Remove films that are not active
    category.films = category.films.filter((film) => film.status);

    return category;
  }

  async create(categoryData: CreateCategoryDTO): Promise<Category> {
    return await this.categoryRepository.save(categoryData);
  }

  async update(id: string, categoryData: UpdateCategoryDTO): Promise<Category> {
    await this.categoryRepository.update(id, categoryData);

    return this.categoryRepository.findOne({ where: { categoryId: id } });
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
