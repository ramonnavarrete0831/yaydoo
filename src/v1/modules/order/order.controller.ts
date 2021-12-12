import { Controller, Logger, Post, ValidationPipe, Param, UseGuards, Body, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { TokenDto } from '../../../two-step-verification/dto/token.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../../entities/user.entity';
import { GetUser } from '../../../auth/get-user.decorators';
import { OrderInfoDto } from '../dto/order-info.dto';
import { Order } from '../../../entities/order.entity';

@Controller('order')
export class OrderController {
    private logger = new Logger("OrderController");
    constructor(private orderService: OrderService) {}

    @UseGuards(AuthGuard())
    @Post("create/:token")
    async create(@GetUser() userLogged: User,@Param(ValidationPipe) tokenDto: TokenDto,  @Body(ValidationPipe) orderInfoDto:OrderInfoDto): Promise<{order_id: number}>{
      this.logger.verbose(`realiza petición para processar la orden de compra`);
      const order_id = await this.orderService.create(userLogged,tokenDto,orderInfoDto);
      return order_id;
    }

    @UseGuards(AuthGuard())
    @Get("list/")
    async list(@GetUser() userLogged: User): Promise<{orders:Order[]}>{
      this.logger.verbose(`realiza consultar la información de pedidos del cliente`);
      const orders = await this.orderService.list(userLogged);
      return orders;
    }
}
