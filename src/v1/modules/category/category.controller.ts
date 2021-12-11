import { Controller, Logger, Get, ValidationPipe, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../../../entities/category.entity';
import { IdDto } from '../dto/id.dto';

@Controller('category')
export class CategoryController {
    private logger = new Logger("CategoryController");
    constructor(private categoryService:CategoryService) {}

    @Get("/list")
    async list(): Promise<{categories:Category[]}>{
        this.logger.verbose(`Petición para obtener la lista de categorias completa`);
        const categories = await this.categoryService.list(false);
        return {categories};
    }

    @Get("/public-list")
    async publicList(): Promise<{categories:Category[]}> {
        this.logger.verbose(`Petición para obtener la lista de categorias públicas`);
        const categories = await this.categoryService.list(true);
        return {categories};
    }

    @Get("/:id")
    async getCategoryById(@Param(ValidationPipe) idDto: IdDto): Promise<{category:Category}> {
        this.logger.verbose(`Petición para obtener detalles de la categoría por Id`);
        const category = await this.categoryService.getCategoryById(idDto);
        return { category };
    }
}
