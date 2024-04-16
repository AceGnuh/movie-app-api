import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ResponseDTO } from 'src/DTOs/response.dto';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from 'src/DTOs/category.dto';
import { Public } from 'src/auth/auth.decorator';

@Public()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories(): Promise<ResponseDTO<Category[]>> {
    const categories = await this.categoryService.findAll();

    if (!categories.length) {
      throw new NotFoundException('No categories found');
    }

    return new ResponseDTO<Category[]>(HttpStatus.OK, categories);
  }

  @Get(':id')
  async getCategoryById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseDTO<Category>> {
    const category = await this.categoryService.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found or not available');
    }

    return new ResponseDTO<Category>(HttpStatus.OK, category);
  }

  @Post()
  async createCategory(
    @Body() categoryData: CreateCategoryDTO,
  ): Promise<ResponseDTO<Category>> {
    const category = await this.categoryService.create(categoryData);

    return new ResponseDTO<Category>(HttpStatus.CREATED, category);
  }

  @Put(':id')
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() categoryData: UpdateCategoryDTO,
  ): Promise<ResponseDTO<Category>> {
    const category = await this.categoryService.update(id, categoryData);

    if (!category) {
      throw new NotFoundException('Category not found or not available');
    }

    return new ResponseDTO<Category>(HttpStatus.OK, category);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.categoryService.delete(id);
  }
}
