
import { Repository, EntityRepository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ShoppingCart } from '../../entities/shopping-cart.entity';
import { Product } from '../../entities/product.entity';
import { CartDetail } from '../../entities/cart-detail.entity';

@EntityRepository(CartDetail)
export class CartDetailRepository extends Repository<CartDetail>{
    private logger = new Logger("CartDetail");

    async insertDetail(shoppingCart: ShoppingCart, product:Product, qty:number, total:number): Promise<number> {
        const { id:shopping_cart_id } = shoppingCart;
        const { id:product_id, name, price} = product;

        const query = this.createQueryBuilder()
          .insert()
          .into(CartDetail)
          .values([
            {
                shopping_cart_id,
                product_id,
                name,
                price,
                qty,
                total
            },
          ]);
    
        try {
          const insert= await query.execute();
          return insert.raw.insertId;
        } catch (error) {
          this.logger.error(
            `Error al realizar la consulta ${JSON.stringify(query.getQuery())}`,
            error.stack
          );
        }
      }
}