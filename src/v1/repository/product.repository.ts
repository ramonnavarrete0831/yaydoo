import { Repository, EntityRepository } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Product } from '../../entities/product.entity';
import { GetProductFilterDto } from '../modules/dto/get-products-filter.dto';
import { PaginationDto } from '../modules/dto/pagination.dto';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product>{
    private logger = new Logger("ProductRepository");
    
    async findProducts(getProductFilterDto: GetProductFilterDto, paginationDto: PaginationDto): Promise<Pagination<Product>>{
        const { product, category_id, sku, min_price, max_price} = getProductFilterDto;
        const { page = "1", limit = "5" , route} = paginationDto;

        const query = this.createQueryBuilder("Product")
        .innerJoinAndSelect("Product.category", "Category")
        .leftJoinAndSelect("Product.pointsOfSale", "PointsOfSale")
        .select([
            "Product.id",
            "Product.name",
            "Product.friendly_url",
            "Product.description",
            "Product.price",
            "Product.position",
            "Product.available",
            "PointsOfSale.id",
            "PointsOfSale.name",
            "Category.id",
            "Category.name",
        ]).orderBy("Product.position","ASC");

        let where = "";
        let data = {};

        if(sku){
            where+=" Product.id=:sku AND";
            data['sku']=sku;
        }

        if(product){
            where+=" Product.name like :name AND";
            data['name']=`%${product}%`;
        }

        if(category_id){
            where+=" Product.category_id=:category_id AND";
            data['category_id']=category_id;
        }

        if(min_price && max_price){
            where+=" Product.price BETWEEN :min_price AND :max_price AND";
            data['min_price']=min_price;
            data['max_price']=max_price;
        }else if(min_price && !max_price){
            where+=" Product.price >= :min_price AND";
            data['min_price']=min_price;
        }else if(max_price && !min_price){
            where+=" Product.price <= :max_price AND";
            data['max_price']=max_price;
        }

        where = where.substring(0, where.length - 3);

        if(where!=""){
            query.where(where,data)
        }

        const options: IPaginationOptions = {
            page: parseInt(page),
            limit: parseInt(limit),
            route,
        };

        try {
            return paginate<Product>(query, options);
        } catch (error) {
          this.logger.error(
            `Error al realizar la consulta ${query.getQuery()}`,
            error.stack
          );
          throw new InternalServerErrorException();
        }
    }

    async findPackages(paginationDto: PaginationDto,available:boolean): Promise<Pagination<Product>>{
        const { page = "1", limit = "5" , route} = paginationDto;

        const query = this.createQueryBuilder("Product")
        .orderBy("Product.position","ASC");

        if(available){
            query.leftJoinAndSelect("Product.images", "Images")
            .select([
                "Product.id",
                "Product.name",
                "Product.friendly_url",
                "Product.description",
                "Product.price",
                "Product.position",
                "Images.id",
                "Images.uri",
            ]).where("Product.available = :available and category_id  IS NULL", {
                available : 1,
            });
        }else{
            query.select([
                "Product.id",
                "Product.name",
                "Product.friendly_url",
                "Product.description",
                "Product.price",
                "Product.position",
                "Product.available",
            ]).where("category_id  IS NULL");
        }

        const options: IPaginationOptions = {
            page: parseInt(page),
            limit: parseInt(limit),
            route,
        };

        try {
            return paginate<Product>(query, options);
        } catch (error) {
          this.logger.error(
            `Error al realizar la consulta ${query.getQuery()}`,
            error.stack
          );
          throw new InternalServerErrorException();
        }
    }

    async getProduct(id: number): Promise<Product> {
        const query = this.createQueryBuilder("Product")
        .leftJoinAndSelect("Product.images", "Images")
        .leftJoinAndSelect("Product.pointsOfSale", "PointsOfSale")
        .leftJoinAndSelect("Product.category", "Category")
        .select([
            "Product.id",
            "Product.name",
            "Product.category_id",
            "Product.friendly_url",
            "Product.description",
            "Product.price",
            "Product.position",
            "Product.available",
            "Category.id",
            "Category.name",
            "Images.id",
            "Images.uri",
            "PointsOfSale.id",
            "PointsOfSale.name",
        ]).where("Product.id = :id", {
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

    async getProductFriendlyUrl(friendly_url : string): Promise<Product> {
        const query = this.createQueryBuilder("Product")
        .leftJoinAndSelect("Product.images", "Images")
        .leftJoinAndSelect("Product.pointsOfSale", "PointsOfSale")
        .leftJoinAndSelect("Product.category", "Category")
        .select([
            "Product.id",
            "Product.name",
            "Product.category_id",
            "Product.friendly_url",
            "Product.description",
            "Product.price",
            "Product.position",
            "Product.available",
            "Category.id",
            "Category.name",
            "Images.id",
            "Images.uri",
            "PointsOfSale.id",
            "PointsOfSale.name",
        ]).where("Product.available = :available and Product.friendly_url = :friendly_url", {
            friendly_url,
            available : 1,
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

    async findProductsPointOfSales(point_of_sale_id : number, getProductFilterDto : GetProductFilterDto, paginationDto : PaginationDto): Promise<Pagination<Product>>{
        const { product, category_id} = getProductFilterDto;
        const { page = "1", limit = "5" , route} = paginationDto;

        const query = this.createQueryBuilder("Product")
        .innerJoinAndSelect("Product.category", "Category")
        .leftJoinAndSelect("Product.images", "Images")
        .innerJoinAndSelect("Product.pointsOfSale", "PointsOfSale")
        .select([
            "Product.id",
            "Product.name",
            "Product.friendly_url",
            "Product.description",
            "Product.price",
            "Product.position",
            "Category.id",
            "Category.friendly_url",
            "Category.name",
            "Images.id",
            "Images.uri",
        ]).where("Product.available = :available and PointsOfSale.id = :point_of_sale_id", {
            available : 1,
            point_of_sale_id,
        }).orderBy("Product.position","ASC");
        
        
        if(category_id && product){
            query.where("Product.category_id=:category_id and Product.name like :name", { category_id, name:`%${product}%` })
        }else if(category_id){
            query.where("Product.category_id=:category_id", { category_id })
        }else if(product){
            query.where("Product.name like :name", { name:`%${product}%` })
        }

        const options: IPaginationOptions = {
            page: parseInt(page),
            limit: parseInt(limit),
            route,
        };

        try {
            return paginate<Product>(query, options);
        } catch (error) {
          this.logger.error(
            `Error al realizar la consulta ${query.getQuery()}`,
            error.stack
          );
          throw new InternalServerErrorException();
        }
    }
}