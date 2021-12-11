import { HttpModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { WhatsappService } from '../whatsapp/whatsapp.service';
//import { WebhookController } from './modules/webhook/webhook.controller';
//import { WebhookService } from './modules/webhook/webhook.service';
import { CategoryController } from './modules/category/category.controller';
import { CategoryService } from './modules/category/category.service';
import { CategoryRepository } from './repository/category.repository';
import { ProductController } from './modules/product/product.controller';
import { ProductService } from './modules/product/product.service';
import { ProductRepository } from './repository/product.repository';
import { PointOfSaleRepository } from './repository/point-of-sale.repository';
import { PointOfSaleController } from './modules/point-of-sale/point-of-sale.controller';
import { PointOfSaleService } from './modules/point-of-sale/point-of-sale.service';
import { ShoppingCartController } from './modules/shopping-cart/shopping-cart.controller';
import { ShoppingCartService } from './modules/shopping-cart/shopping-cart.service';
import { ShoppingCartRepository } from './repository/shopping-cart.repository';
import { CartDetailRepository } from './repository/cart-detail.repository';
import { OrderController } from './modules/order/order.controller';
import { OrderService } from './modules/order/order.service';
import { OrderRepository } from './repository/order.repository';
import { ConektaService } from '../conekta/conekta.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 25000,
    }),
    AuthModule,
    TypeOrmModule.forFeature([CategoryRepository,ProductRepository,PointOfSaleRepository,ShoppingCartRepository,CartDetailRepository, OrderRepository]),
  ],
  controllers: [
    //WebhookController,
  CategoryController,
    ProductController,
    PointOfSaleController,
    ShoppingCartController,
    OrderController
  ],
  providers: [
    WhatsappService,
    ConektaService,
    //WebhookService,
  CategoryService,
    ProductService,
    PointOfSaleService,
    ShoppingCartService,
    OrderService],
})
export class V1Module {}

/*
nest g module auth
nest g controller v1/modules/point-of-sale --no-spec
nest g service v1/modules/shopping_cart --no-spec
*/
