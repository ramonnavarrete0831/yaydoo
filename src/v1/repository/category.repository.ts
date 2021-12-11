
import { Repository, EntityRepository } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { Category } from '../../entities/category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category>{
    private logger = new Logger("CategoryRepository");
    
    async findCategories(available:boolean): Promise<Category[]> {
        const query = this.createQueryBuilder("Category")
        .orderBy("Category.id","ASC");
  
        if(available){
          query.select([
            "Category.friendly_url",
            "Category.name",
          ]).where("Category.available = :available", {
            available : 1
          });
        }else{
          query.select([
            "Category.id",
            "Category.name",
            "Category.friendly_url",
            "Category.available",
          ])
        }

        try {
          return await query.getMany();
        } catch (error) {
          this.logger.error(
            `Error al realizar la consulta ${query.getQuery()}`,
            error.stack
          );
          throw new InternalServerErrorException();
        }
    }

    async getCategoryById(id: number): Promise<Category> {
      const query = this.createQueryBuilder("Category")
      .select([
          "Category.id",
          "Category.name",
          "Category.friendly_url",
          "Category.available",
      ]).where("Category.id = :id", {
          id,
      });
  
      try {
        return await query.getOne();
      } catch (error) {
        this.logger.error(
          `Error al realizar la consulta ${query.getQuery()}`,
          error.stack
        );
        throw new InternalServerErrorException();
      }
  }

  async getCategoryByFriendlyUrl(friendly_url: string): Promise<Category> {
    const query = this.createQueryBuilder("Category")
    .select([
        "Category.id",
    ]).where("category.friendly_url = :friendly_url and Category.available = :available", {
      friendly_url,
        available : 1
    });

    try {
      return await query.getOne();
    } catch (error) {
      this.logger.error(
        `Error al realizar la consulta ${query.getQuery()}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
}
}