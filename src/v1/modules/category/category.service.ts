import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../../entities/category.entity';
import { CategoryRepository } from '../../repository/category.repository';
import { IdDto } from '../dto/id.dto';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category) private categoryRepository: CategoryRepository
    ) {}

    async list(avaible:boolean):Promise<Category[]>{
        const categoriesResult = await this.categoryRepository.findCategories(avaible);
        return categoriesResult;
    }

    async getCategoryById(idDto: IdDto):Promise<Category>{
        const { id } = idDto
        const categoryResult = await this.categoryRepository.getCategoryById(id);

        if(!categoryResult){
            throw new NotFoundException(
                `Ups! la categoría no fué encontrada.`
            );
        }
        return categoryResult;
    }
}
