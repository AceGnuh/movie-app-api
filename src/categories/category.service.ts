import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import {
  CreateCategoryDTO,
  PartialUpdateCategoryDTO,
  UpdateCategoryDTO,
} from 'src/DTOs/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['films'],
      where: {
        status: true,
      },
      order: {
        order: 'DESC',
      },
    });
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      relations: ['films'],
      where: {
        categoryId: id,
        status: true,
      },
    });

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

  async partialUpdate(
    id: string,
    categoryData: PartialUpdateCategoryDTO,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId: id },
    });

    category.status = categoryData?.status || category.status;
    category.order = categoryData?.order || category.order;

    await this.categoryRepository.update(id, category);

    return category;
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
