import { Controller, Logger, Post, Get, ValidationPipe, Param, Body, Delete } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCart } from '../../../entities/shopping-cart.entity';
import { TokenDto } from '../../../two-step-verification/dto/token.dto';
import { CartAddItemDto } from '../dto/cart-add-item.dto';
import { CartDetail } from '../../../entities/cart-detail.entity';
import { IdDto } from '../dto/id.dto';

@Controller('shopping-cart')
export class ShoppingCartController {
    private logger = new Logger("ShoppingCartController");
    constructor(private shoppingCartService: ShoppingCartService) {}

    @Post("create")
    async create(): Promise<{public_id: string}>{
      this.logger.verbose(`realiza petición para crear carrito de compras}`);
      return this.shoppingCartService.create();
    }

    @Get("/:token")
    async detail(@Param(ValidationPipe) tokenDto: TokenDto): Promise<{shoppingCart:ShoppingCart}>{
        this.logger.verbose(`Petición para obtener los detalles del carrito de compras`);
        const shoppingCart = await this.shoppingCartService.detail(tokenDto);
        return {shoppingCart};
    }

    @Post("add-item/:token")
    async addItem(@Param(ValidationPipe) tokenDto: TokenDto, @Body(ValidationPipe) cartAddItemDto:CartAddItemDto): Promise<{cartDetail:CartDetail}>{
        this.logger.verbose(`Petición agregar un item al carrito de compras`);
        const cartDetail = await this.shoppingCartService.addItem(tokenDto,cartAddItemDto);
        return { cartDetail };
    }

    @Delete("remove/:token/:id")
    async removeItem(@Param(ValidationPipe) tokenDto: TokenDto,@Param(ValidationPipe) idDto: IdDto): Promise<void>{
        this.logger.verbose(`Petición eliminar un item del carrito de compras`);
        await this.shoppingCartService.removeItem(tokenDto,idDto);
    }
}
