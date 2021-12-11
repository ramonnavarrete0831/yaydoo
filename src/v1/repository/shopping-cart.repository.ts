
import { Repository, EntityRepository } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { ShoppingCart } from '../../entities/shopping-cart.entity';
import { TokenDto } from '../../two-step-verification/dto/token.dto';

@EntityRepository(ShoppingCart)
export class ShoppingCartRepository extends Repository<ShoppingCart>{
    private logger = new Logger("ShoppingCartRepository");

    async insertCart(public_id:string): Promise<Boolean> {
        const time = 30 * 60;
        const query = this.createQueryBuilder()
          .insert()
          .into(ShoppingCart)
          .values([
            {
              public_id,
              total:0,
              expires_at: Math.floor(Date.now() / 1000) + time,
            },
          ]);
    
        try {
          await query.execute();
          return true;
        } catch (error) {
          this.logger.error(
            `Error al realizar la consulta ${JSON.stringify(query.getQuery())}`,
            error.stack
          );
        }
      }

      async findProcess(tokenDto: TokenDto): Promise<ShoppingCart> {
        const { token:public_id } = tokenDto;
        const query = this.createQueryBuilder("ShoppingCart")
        .leftJoinAndSelect("ShoppingCart.cartDetail", "CartDetail")
        .select([
          "ShoppingCart.id",
          "ShoppingCart.public_id",
          "ShoppingCart.total",
          "ShoppingCart.expires_at",
          "CartDetail.id",
          "CartDetail.product_id",
          "CartDetail.name",
          "CartDetail.price",
          "CartDetail.qty",
          "CartDetail.total",
        ]).where(
          "ShoppingCart.public_id = :public_id",
          {
            public_id,
          }
        );

        try {
          return await query.getOne();
        } catch (error) {
          this.logger.error(
            `Error al realizar la consulta ${query.getQuery()}`,
            error.stack
          );
          throw new InternalServerErrorException();
        }
    }
}