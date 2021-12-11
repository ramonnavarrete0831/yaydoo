import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ShoppingCartRepository } from '../../repository/shopping-cart.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ShoppingCart } from '../../../entities/shopping-cart.entity';
import { TokenDto } from '../../../two-step-verification/dto/token.dto';
import { CartAddItemDto } from '../dto/cart-add-item.dto';
import { ProductRepository } from '../../repository/product.repository';
import { CartDetailRepository } from '../../repository/cart-detail.repository';
import { CartDetail } from '../../../entities/cart-detail.entity';
import { Product } from '../../../entities/product.entity';
import * as _ from "lodash";
import { IdDto } from '../dto/id.dto';

@Injectable()
export class ShoppingCartService {

    constructor(
        @InjectRepository(ShoppingCartRepository) private shoppingCartRepository: ShoppingCartRepository,
        @InjectRepository(CartDetailRepository) private cartDetailRepository: CartDetailRepository,
        @InjectRepository(ProductRepository) private productRepository: ProductRepository,
    ) {}

    async create(): Promise<{public_id: string}> {
        const public_id = uuidv4();
        const tokenCart = await this.shoppingCartRepository.insertCart(public_id);

        if (!tokenCart) {
            throw new InternalServerErrorException(
              `Ups! no pudimos generar el carrito de compras, intente nuevamente.`
            );
        }

        return {public_id: public_id};
    }

    async detail(tokenDto: TokenDto):Promise<ShoppingCart>{
        const shoppingCart = await this.shoppingCartRepository.findProcess(tokenDto);
        if(!shoppingCart){
            throw new NotFoundException(
                `Ups! carrito de compra no encontrado.`
            );
        }
        return shoppingCart;
    } 

    async addItem(tokenDto: TokenDto,cartAddItemDto:CartAddItemDto):Promise<CartDetail>{
        const {  product_id} = cartAddItemDto;
        const { qty } = cartAddItemDto;
        const shoppingCart = await this.verifyProcess(tokenDto);
        const { public_id, cartDetail} = shoppingCart;

        const product = await this.verifyProduct(cartAddItemDto);
        const { price } = product;

        let quantity = parseInt(qty);

        if(quantity<1){
            throw new BadRequestException(
                `Ups! la cantidad para añadir no puede ser menor a 0.`
            );
        }


        const findProduct = _.find(cartDetail, function(item) {return item.product_id == product_id ? item : null; });
        const filterProduct = _.filter(cartDetail, function(item) {return item.product_id != product_id ? item : null; });

        let cartTotal = 0 ;

        if(findProduct){
            const { id, qty } = findProduct;
            quantity = quantity +  qty;
            this.cartDetailRepository.delete({id});
        }

        const total = quantity *  price;
        const inserted = await this.cartDetailRepository.insertDetail(shoppingCart,product,quantity,total);
        
        if(!inserted){
            throw new BadRequestException(
                `Ups! ocurrió un error al intentar agregar el producto al carrito de compras.`
            );
        }

        _.forEach(filterProduct, function(item) {
            cartTotal = cartTotal + item.total;
        });

        cartTotal = cartTotal + total;
        await this.shoppingCartRepository.update({public_id},{total:cartTotal});

        const resultDetail = await this.cartDetailRepository.findOne(inserted);

        delete resultDetail.shopping_cart_id;
        return resultDetail;
    } 

    async removeItem(tokenDto: TokenDto, idDto: IdDto):Promise<void>{
        const shoppingCart = await this.verifyProcess(tokenDto);
        const { public_id,cartDetail } = shoppingCart;
        const { id:cartDetailId } = idDto;
        
        const findProduct = _.find(cartDetail, function(item) {return item.id == cartDetailId ? item : null; });
        const filterProduct = _.filter(cartDetail, function(item) {return item.id != cartDetailId ? item : null; });

        let cartTotal = 0 ;

        if(!findProduct){
            throw new NotFoundException(
                `Ups! el producto no fué encontrado en el carrito de compras.`
            );  
        }

        const { id } = findProduct;
        this.cartDetailRepository.delete({id});

        _.forEach(filterProduct, function(item) {
            cartTotal = cartTotal + item.total;
        });

        await this.shoppingCartRepository.update({public_id},{total:cartTotal});
    } 

    async verifyProcess(tokenDto: TokenDto):Promise<ShoppingCart>{
        const shoppingCart = await this.shoppingCartRepository.findProcess(tokenDto);
        if(!shoppingCart){
            throw new NotFoundException(
                `Ups! carrito de compra no encontrado.`
            );
        }
        return shoppingCart;
    }

    async verifyProduct(cartAddItemDto:CartAddItemDto):Promise<Product>{
        const { product_id } = cartAddItemDto;
        const product = await this.productRepository.findOne(product_id);
        if(!product){
            throw new NotFoundException(
                `Ups! el producto que desea añadir no existe.`
            );
        }
        return product;
    }

}
