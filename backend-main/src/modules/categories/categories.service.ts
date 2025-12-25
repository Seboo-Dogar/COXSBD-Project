import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database-prisma/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.category.findMany();
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return this.databaseService.category.create({
      data: createCategoryDto,
    });
  }
}