import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from '../../../entities/product.entity';
import { ProductRepository } from '../../repository/product.repository';
import { GetProductFilterDto } from '../dto/get-products-filter.dto';
import { PointOfSaleCodeDto } from '../dto/point-of-sale-code.dto';
import { PointOfSaleRepository } from '../../repository/point-of-sale.repository';
import { PointOfSale } from '../../../entities/point-of-sale.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { IdDto } from '../dto/id.dto';
import { Category } from '../../../entities/category.entity';
import { CategoryRepository } from '../../repository/category.repository';
import { FriendlyUrlDto } from '../dto/friendlyurl.dot';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private productRepository:ProductRepository,
        @InjectRepository(PointOfSale) private pointOfSaleRepository:PointOfSaleRepository,
        @InjectRepository(Category) private categoryRepository:CategoryRepository
    ){}

    async list(getProductFilterDto: GetProductFilterDto, paginationDto: PaginationDto):Promise<Pagination<Product>>{
        const {  category } = getProductFilterDto;
       
        if(category){
            const categoryResult = await this.categoryRepository.getCategoryByFriendlyUrl(category);
            if(!categoryResult){
                throw new NotFoundException(
                    `Ups! la categoría no fué encontrada.`
                );
            }
            getProductFilterDto.category_id = categoryResult.id;
        }
        
        const url = this.createUrl(getProductFilterDto);
        paginationDto.route=`v.1/product/list${url}`;

        const productsResult = await this.productRepository.findProducts(getProductFilterDto, paginationDto);
        return  productsResult;
    }

    createUrl(getProductFilterDto: GetProductFilterDto):String{
        const { product, category , sku, min_price, max_price} = getProductFilterDto;
        let url = "?";
        let params = { "product":product, "category":category,"sku":sku};

        if(min_price && max_price){
            params['min_price']=min_price;
            params['max_price']=max_price;
        }else if(min_price && !max_price){
            params['min_price']=min_price;
        }else if(max_price && !min_price){
            params['max_price']=max_price;
        }
    
        for(const clave in params) {
            if(params[clave]!=undefined){
                url += `${clave}=${params[clave]}&`;
            }
        }

        url = url.substring(0, url.length - 1);
        return url;
    }

    async packages(paginationDto: PaginationDto, available:boolean):Promise<Pagination<Product>>{
        paginationDto.route=`v.1/product/packages`;
        const productsResult = await this.productRepository.findPackages(paginationDto,available);
        return  productsResult;
    }

    async getProduct(idDto: IdDto, type : string):Promise<Product>{
        const { id } = idDto
        const productResult = await this.productRepository.getProduct(id);

        if(!productResult){
            if(type=='product'){
                throw new NotFoundException(
                    `Ups! el producto no fué encontrado.`
                );
            }else if(type=='package'){
                throw new NotFoundException(
                    `Ups! el paquete no fué encontrado.`
                );
            } 
        }

        if(type=='package'){
            if(productResult.category_id){
                throw new NotFoundException(
                    `Ups! el paquete no fué encontrado.`
                );
            }
            delete productResult.category;
            delete productResult.pointsOfSale;
        }else if(type=='product'){
            if(!productResult.category_id){
                throw new NotFoundException(
                    `Ups! el producto no fué encontrado.`
                );
            }
        }

        delete productResult.category_id;
        return productResult;
    }
    
    async getProductFriendlyUrl(friendlyUrlDto: FriendlyUrlDto, type : string):Promise<Product>{
        const { friendly_url } = friendlyUrlDto
        const productResult = await this.productRepository.getProductFriendlyUrl(friendly_url);

        if(!productResult){
            if(type=='product'){
                throw new NotFoundException(
                    `Ups! el producto no fué encontrado.`
                );
            }else if(type=='package'){
                throw new NotFoundException(
                    `Ups! el paquete no fué encontrado.`
                );
            } 
        }

        if(type=='package'){
            if(productResult.category_id){
                throw new NotFoundException(
                    `Ups! el paquete no fué encontrado.`
                );
            }
            delete productResult.category;
            delete productResult.pointsOfSale;
        }else if(type=='product'){
            if(!productResult.category_id){
                throw new NotFoundException(
                    `Ups! el producto no fué encontrado.`
                );
            }
        }
        
        delete productResult.category_id;
        return productResult;
    }

    async listPointOfSales(getProductFilterDto: GetProductFilterDto, pointOfSaleCodeDto: PointOfSaleCodeDto, paginationDto: PaginationDto):Promise<Pagination<Product>>{
        const { code } = pointOfSaleCodeDto;
        const { product, category } = getProductFilterDto;

        const pointOfSaleResult = await this.pointOfSaleRepository.findOne({code});
       
        if(!pointOfSaleResult){
            throw new NotFoundException(
                `Ups! el catálogo "${code}" no fué encontrado .`
            );
        }

        if(category){
            const categoryResult = await this.categoryRepository.getCategoryByFriendlyUrl(category);
            if(!categoryResult){
                throw new NotFoundException(
                    `Ups! la categoría no fué encontrada.`
                );
            }
            getProductFilterDto.category_id = categoryResult.id;
        }

        paginationDto.route=`v.1/product/${pointOfSaleResult.code}/list`;
        
        if(product && category){
            paginationDto.route+=`?product=${product}&category=${category}`;
        }else if(category){
            paginationDto.route+=`?category_id=${category}`;
        }else if(product){
            paginationDto.route+=`?product=${product}`;
        }

        const { id  } = pointOfSaleResult;
        const productsResult = await this.productRepository.findProductsPointOfSales(id , getProductFilterDto,paginationDto);
        return  productsResult;
    }

}
