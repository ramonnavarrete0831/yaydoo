import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { TokenDto } from '../../../two-step-verification/dto/token.dto';
import { OrderInfoDto} from '../dto/order-info.dto';
import { ShoppingCartRepository } from '../../repository/shopping-cart.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from '../../repository/order.repository';
import { randomStringNumber } from '../../../utils/functions';
import { SendMessageDto } from '../../../whatsapp/dto/send-message.dto';
import { WhatsappService } from '../../../whatsapp/whatsapp.service';
import * as _ from "lodash";
import { ShoppingCart } from '../../../entities/shopping-cart.entity';
import { CartDetail } from '../../../entities/cart-detail.entity';
import { ConektaService } from '../../../conekta/conekta.service';
import { OrderDto } from '../../../conekta/dto/order.dto';
import { CustomerDto } from '../../../conekta/dto/customer.dto';
import { PaymentType } from '../enum/payment-type.enum';
import { Order } from '../../../entities/order.entity';

@Injectable()
export class OrderService {
    
    constructor(
        @InjectRepository(OrderRepository) private orderRepository: OrderRepository,
        @InjectRepository(ShoppingCartRepository) private shoppingCartRepository: ShoppingCartRepository,
        private whatsappService: WhatsappService,
        private conektaService: ConektaService,
    ){}
  
    async create(userLogged: User, tokenDto: TokenDto, orderInfoDto:OrderInfoDto): Promise<{order_id: number}>{
        const shoppingCart = await this.shoppingCartRepository.findProcess(tokenDto);
        
        if(!shoppingCart){
            throw new NotFoundException(
                `Ups! carrito de compra no encontrado.`
            );
        }
        
        const { total } = shoppingCart;

        if(total==0){
            throw new BadRequestException(
                `Ups! carrito de compra se encuentra vacío.`
            );
        }

        const public_id = randomStringNumber(11);
        const order_id = await this.orderRepository.insertOrder(userLogged,shoppingCart,public_id,orderInfoDto);
        
        const payment : OrderDto = await this.createPaymentInstructions(shoppingCart,orderInfoDto,order_id);
        await this.sendDetail(userLogged,shoppingCart,orderInfoDto,payment,public_id,order_id);

        return {order_id};
    }
   
    async createPaymentInstructions(shoppingCart: ShoppingCart,orderInfoDto:OrderInfoDto,order_id:number): Promise<OrderDto> {
        const { payment_type } = orderInfoDto;
        if(payment_type == PaymentType.CASH){
            return null;
        }
        
        const { total } = shoppingCart;
        const orderDto : OrderDto =  new OrderDto();
        orderDto.order_id = order_id;
        orderDto.type = payment_type;
        orderDto.amount = total * 100;
        const customerDto:CustomerDto= new CustomerDto();
        customerDto.id = "cus_2pTbzQ5dUEMSdFjy4";
        orderDto.customer = customerDto; 
        await this.conektaService.createOrder(orderDto);
        return orderDto;
    }

    async sendDetail(userLogged: User, shoppingCart: ShoppingCart,orderInfoDto:OrderInfoDto,payment:OrderDto,public_id:string, order_id:number): Promise<void> {
        const{ profile:{mobile_phone}} = userLogged;
        const{ cartDetail, total } = shoppingCart;
        const{ address, payment_type } = orderInfoDto;
        const sendMessageDto: SendMessageDto =  new SendMessageDto();
        sendMessageDto.phone =`521${mobile_phone}`;
        sendMessageDto.chatId = `521${mobile_phone}@c.us`;
        sendMessageDto.body = `*ORDEN DE COMPRA*\n\n`;

        for (let index = 0; index < _.size(cartDetail); index++) {
            const itemDetail : CartDetail = cartDetail[index];
            sendMessageDto.body += `*${itemDetail.name}*\n`;
            sendMessageDto.body += `  Cant. ${itemDetail.qty} x $${itemDetail.price} =  *$${itemDetail.total}*\n\n`;
        }

        sendMessageDto.body += `*OrderId* : ${order_id}\n`;
        sendMessageDto.body += `*Total* : $${total}\n`;
        sendMessageDto.body += `*Pago* : ${payment_type}\n\n`;
        sendMessageDto.body += `*Dirección* : ${address}\n\n`;

        if(payment){
            const { type, payment:{ clabe, bank, reference }} = payment;
            
            if(type==PaymentType.OXXO){
                sendMessageDto.body += `*PAGO POR OXXO*\n`;
                sendMessageDto.body += `*Referencia* : ${reference}\n`;
            }else if(type==PaymentType.SPEI){
                sendMessageDto.body += `*PAGO POR SPEI*\n`;
                sendMessageDto.body += `*Banco* : ${bank}\n`;
                sendMessageDto.body += `*CLABE* : ${clabe}\n`;
            }
        }

        await this.whatsappService.sendMessage(sendMessageDto);
    }

    async list(userLogged: User): Promise<{orders:Order[]}>{
        const orders = await this.orderRepository.findOrders(userLogged);
        return { orders };
    }
}
