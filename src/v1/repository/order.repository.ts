
import { Repository, EntityRepository, getManager } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { Order } from '../../entities/order.entity';
import { ShoppingCart } from '../../entities/shopping-cart.entity';
import { User } from '../../entities/user.entity';
import * as _ from "lodash";
import { OrderDetail } from '../../entities/order-detail.entity';
import { CartDetail } from 'src/entities/cart-detail.entity';
import { OrderInfoDto } from '../modules/dto/order-info.dto';
import { OrderDelivery } from '../../entities/order-delivery.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order>{
    private logger = new Logger("OrderRepository");
    async insertOrder(userLogged: User,shoppingCart:ShoppingCart,public_id:string,orderInfoDto:OrderInfoDto): Promise<number> {
        const { address } = orderInfoDto;
        const { id: customer_id} = userLogged;
        const { id: shopping_cart_id, total, cartDetail } = shoppingCart;

        try {
            let order_id = null;
            await getManager()
            .transaction(async (transactionalEntityManager) => {
                const order : Order = new Order();
                order.public_id = public_id;
                order.code = 1234;
                order.seller_id = 0 ;
                order.customer_id = customer_id;
                order.created_on = Math.floor(Date.now() / 1000);
                order.subtotal = total;
                order.discount = 0 ;
                order.total = total ;
                order.order_status = "pending";
                order.mycode_id = 0 ;
                order.recomendation = 0 ;
                order.prepared = 0 ;

                await transactionalEntityManager.save(order);
                order_id = order.id;
                const orderDelivery : OrderDelivery = new OrderDelivery(); 
                orderDelivery.order_id = order.id;
                orderDelivery.store_id = 0 ;
                orderDelivery.datetime_of_delivery = Math.floor(Date.now() / 1000);
                orderDelivery.address = address;
                orderDelivery.department = "";

                await transactionalEntityManager.save(orderDelivery);

                const details: OrderDetail[] = [];
                for (let index = 0; index < _.size(cartDetail); index++) {
                    const itemDetail : CartDetail = cartDetail[index];
                    const orderDetail = new OrderDetail();
                    orderDetail.order_id = order.id;
                    orderDetail.product_id = itemDetail.product_id;
                    orderDetail.name = itemDetail.name;
                    orderDetail.description = itemDetail.name;
                    orderDetail.unit_price = itemDetail.price;
                    orderDetail.qty = itemDetail.qty;
                    orderDetail.subtotal = itemDetail.total;
                    orderDetail.discount = 0;
                    orderDetail.total = itemDetail.total;
                    orderDetail.prepared = 0;
                    details.push(orderDetail);
                }

                await transactionalEntityManager.save(details);
                await transactionalEntityManager.delete(ShoppingCart,{id:shopping_cart_id});
                await transactionalEntityManager.delete(CartDetail,{shopping_cart_id});

            }).catch((error) => {
                throw new InternalServerErrorException(error);
            });

            return order_id;
        } catch (error) {
            this.logger.error(
              `Error al realizar al insertar la información: ${JSON.stringify(
                userLogged
              )} ${JSON.stringify(shoppingCart)}`,
              error.stack
            );
        }
    }

    async findOrders(userLogged: User): Promise<Order[]> {
      const { id : customer_id } = userLogged;
      const query = this.createQueryBuilder("Order")
      .leftJoinAndSelect("Order.orderDetail", "OrderDetail")
      .leftJoinAndSelect("Order.orderDelivery", "OrderDelivery")
      .select([
        "Order.id",
        "Order.public_id",
        "Order.created_on",
        "Order.subtotal",
        "Order.discount",
        "Order.total",
        "Order.order_status",
        "OrderDetail.id",
        "OrderDetail.product_id",
        "OrderDetail.name",
        "OrderDetail.unit_price",
        "OrderDetail.qty",
        "OrderDetail.subtotal",
        "OrderDetail.discount",
        "OrderDetail.total",
        "OrderDelivery.id",
        "OrderDelivery.address",
      ]).where(
        "Order.customer_id = :customer_id",
        {
          customer_id,
        }
      );

      try {
        return await query.getMany();
      } catch (error) {
        this.logger.error(
          `Error al realizar la consulta ${query.getQuery()}`,
          error.stack
        );
        throw new InternalServerErrorException();
      }
  }
    
}