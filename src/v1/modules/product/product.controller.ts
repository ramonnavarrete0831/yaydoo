import { Controller, Logger, Get, Query, ValidationPipe, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../../../entities/product.entity';
import { GetProductFilterDto } from '../dto/get-products-filter.dto';
import {  PointOfSaleCodeDto } from '../dto/point-of-sale-code.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { IdDto } from '../dto/id.dto';
import { FriendlyUrlDto } from '../dto/friendlyurl.dot';

@Controller('product')
export class ProductController {
    private logger = new Logger("ProductController");
    constructor(private productService:ProductService){}

    @Get("/list")
    async lista(@Query(ValidationPipe) getProductFilterDto: GetProductFilterDto, @Query(ValidationPipe) paginationDto: PaginationDto): Promise<{ products: Product[]; meta: any, links: any}> {
        this.logger.verbose(`Petición para obtener la lista de productos`);
        const { items, meta, links } =  await this.productService.list(getProductFilterDto,paginationDto);
        return { products: items, meta, links} ;
    }

    @Get("/event-packages")
    async packages(@Query(ValidationPipe) paginationDto: PaginationDto): Promise<{ eventPackages: Product[]; meta: any, links: any}> {
        this.logger.verbose(`Petición para obtener los paquetes para eventos`);
        const { items, meta, links } =  await this.productService.packages(paginationDto,false);
        return { eventPackages: items, meta, links} ;
    }

   @Get("/public-event-packages")
    async publicPackages(@Query(ValidationPipe) paginationDto: PaginationDto): Promise<{ eventPackages: Product[]; meta: any, links: any}> {
        this.logger.verbose(`Petición para obtener los paquetes para eventos`);
        const { items, meta, links } =  await this.productService.packages(paginationDto,true);
        return { eventPackages : items, meta, links} ;
    }

    @Get("/:id")
    async getProduct(@Param(ValidationPipe) idDto: IdDto): Promise<{Product:Product}> {
        this.logger.verbose(`Petición para obtener la información de un producto`);
        const Product = await this.productService.getProduct(idDto,"product");
        return { Product };
    }

    @Get("friendly-url/:friendly_url")
    async getProductFriendlyUrl(@Param(ValidationPipe) friendlyUrlDto: FriendlyUrlDto): Promise<{Product:Product}> {
        this.logger.verbose(`Petición para obtener la información de un producto`);
        const Product = await this.productService.getProductFriendlyUrl(friendlyUrlDto,"product");
        return { Product };
    }

    @Get("event-package/:id")
    async getPackage(@Param(ValidationPipe) idDto: IdDto): Promise<{Package:Product}> {
        this.logger.verbose(`Petición para obtener la información de un producto`);
        const Package = await this.productService.getProduct(idDto,"package");
        return { Package };
    }

    @Get("event-package/friendly-url/:friendly_url")
    async getPackageFriendlyUrl(@Param(ValidationPipe) friendlyUrlDto: FriendlyUrlDto): Promise<{eventPackage:Product}> {
        this.logger.verbose(`Petición para obtener la información de un producto`);
        const eventPackage = await this.productService.getProductFriendlyUrl(friendlyUrlDto,"package");
        return { eventPackage };
    }

    @Get("/:code/list")
    async listPointOfSales(@Query(ValidationPipe) getProductFilterDto: GetProductFilterDto, @Param(ValidationPipe) pointOfSaleCodeDto: PointOfSaleCodeDto,@Query(ValidationPipe) paginationDto: PaginationDto): Promise<{ products: Product[]; meta: any, links: any}> {
        this.logger.verbose(`Petición para obtener catálogo de productos`);
        const { items, meta, links } =  await this.productService.listPointOfSales(getProductFilterDto, pointOfSaleCodeDto,paginationDto);
        return { products: items, meta, links} ;
    }

}
