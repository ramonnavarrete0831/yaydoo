import { Test } from '@nestjs/testing';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartRepository } from '../../repository/shopping-cart.repository';
import { CartDetailRepository } from '../../repository/cart-detail.repository';
import { ProductRepository } from '../../repository/product.repository';
import { NotFoundException } from '@nestjs/common';


const mockShoppingCartRepository= ()=>({
    findProcess: jest.fn(),
    insertCart: jest.fn(),
});
const mockCartDetailRepository= ()=>({});
const mockProductRepository= ()=>({});
const mockToken ={token:"48ad8ff0-c161-41d2-8f75-973d3a4dc205"};

describe('ShoppingCartService', ()=>{
    let shoppingCartService : ShoppingCartService;
    let shoppingCartRepository ;
    let cartDetailRepository : CartDetailRepository;
    let productRepository : ProductRepository;
    
    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers:[
                ShoppingCartService,
                {provide:ShoppingCartRepository, useFactory : mockShoppingCartRepository},
                {provide:CartDetailRepository, useFactory : mockCartDetailRepository},
                {provide:ProductRepository, useFactory : mockProductRepository},
            ]
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
            console.log(result);
        })
    });

    describe('detail',()=>{
        it('calls ShoppingCartService.detail and return the result', async ()=>{
            const mockShoppingCart = {
                "id": 17,
                "public_id": "48ad8ff0-c161-41d2-8f75-973d3a4dc205",
                "total": 0,
                "expires_at": 1639257911,
                "cartDetail": []
            };

            shoppingCartRepository.findProcess.mockResolvedValue(mockShoppingCart);
            const result = await shoppingCartService.detail(mockToken);
            expect(result).toEqual(mockShoppingCart);
            console.log(result);
        });

        it('calls ShoppingCartRepository.detail and handles and error', async ()=>{
            shoppingCartRepository.findProcess.mockResolvedValue(null);
            expect(shoppingCartService.detail(mockToken)).rejects.toThrow(NotFoundException);
        });
    });
});