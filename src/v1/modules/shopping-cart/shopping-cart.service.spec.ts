import { Test } from '@nestjs/testing';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartRepository } from '../../repository/shopping-cart.repository';
import { CartDetailRepository } from '../../repository/cart-detail.repository';
import { ProductRepository } from '../../repository/product.repository';
import { NotFoundException } from '@nestjs/common';

const mockShoppingCartRepository= ()=>({
    findProcess: jest.fn(),
    insertCart: jest.fn(),
    update: jest.fn(),
});
const mockCartDetailRepository = ()=>({
    insertDetail: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
});
const mockProductRepository= ()=>({
    findOne: jest.fn(),
});
const mockToken = {token:"42fba943-6915-4059-ba1b-b3d5aa35b36d"};
const mockShoppingCart = {
    "id": 17,
    "public_id": "42fba943-6915-4059-ba1b-b3d5aa35b36d",
    "total": 260,
    "expires_at": 1639257911,
    "cartDetail": [{
        "id": 153,
        "product_id": 191,
        "name": "1 de Kg de cochinita",
        "price": 260,
        "qty": 1,
        "total": 260
    }]
};


describe('ShoppingCartService', ()=>{
    let shoppingCartService : ShoppingCartService;
    let shoppingCartRepository ;
    let cartDetailRepository ;
    let productRepository ;
    
    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers:[
                ShoppingCartService,
                {provide:ShoppingCartRepository, useFactory : mockShoppingCartRepository},
                {provide:CartDetailRepository, useFactory : mockCartDetailRepository},
                {provide:ProductRepository, useFactory : mockProductRepository},
            ],imports: [
                
            ],
        }).compile();

        shoppingCartService =  module.get(ShoppingCartService);
        shoppingCartRepository = module.get(ShoppingCartRepository);
        cartDetailRepository = module.get(CartDetailRepository);
        productRepository = module.get(ProductRepository);
    });

    describe('create', ()=>{
        it('calls ShoppingCartService.create and return the result', async ()=>{
            shoppingCartRepository.insertCart.mockResolvedValue(true);
            const result = await shoppingCartService.create();
            expect(result).not.toEqual(null);
        })
    });

    describe('detail',()=>{
        it('calls ShoppingCartService.detail and return the result', async ()=>{
            shoppingCartRepository.findProcess.mockResolvedValue(mockShoppingCart);
            const result = await shoppingCartService.detail(mockToken);
            expect(result).toEqual(mockShoppingCart);
        });

        it('calls ShoppingCartService.detail and handles and error', async ()=>{
            shoppingCartRepository.findProcess.mockResolvedValue(null);
            expect(shoppingCartService.detail(mockToken)).rejects.toThrow(NotFoundException);
        });
    });

    describe('addItem',()=>{
        it('calls ShoppingCartService.addItem and return the result', async ()=>{
            const mockProduct ={
                id: 191,
                category_id: 5,
                friendly_url: '1-de-kg-de-cochinita',
                name: '1 de Kg de cochinita',
                description: '1 de Kg de cochinita',
                price: 260,
                position: 1,
                available: 1
            };

            const mockDetail ={
                "id": 153,
                "product_id": 191,
                "name": "1 de Kg de cochinita",
                "price": 260,
                "qty": 1,
                "total": 260
            };

            shoppingCartRepository.findProcess.mockResolvedValue(mockShoppingCart);
            productRepository.findOne.mockResolvedValue(mockProduct);
            cartDetailRepository.delete.mockResolvedValue(true);
            cartDetailRepository.insertDetail.mockResolvedValue(1);
            shoppingCartRepository.update.mockResolvedValue(true);
            cartDetailRepository.findOne.mockResolvedValue(mockDetail);
            const cartAddItemDto = {product_id:191,qty:1};

            const result = await shoppingCartService.addItem(mockToken,cartAddItemDto);
            expect(result).not.toEqual(null);
        });
    });


    describe('removeItem',()=>{
        it('calls ShoppingCartService.removeItem and return the result', async ()=>{
            shoppingCartRepository.findProcess.mockResolvedValue(mockShoppingCart);
            cartDetailRepository.delete.mockResolvedValue(true);
            shoppingCartRepository.update.mockResolvedValue(true);
            const mockId = {id:153};
            const result = await shoppingCartService.removeItem(mockToken,mockId);
            expect(result).toEqual(result);
        });
    });
});