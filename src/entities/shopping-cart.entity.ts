import { Column, Entity, OneToMany } from 'typeorm';
import { CartDetail } from './cart-detail.entity';
import { IdPrimaryKey } from './id-primary-key';

@Entity("shopping_carts")
export class ShoppingCart extends IdPrimaryKey{
  
  @Column("varchar")
  public_id: string;

  @Column("decimal")
  total: number;

  @Column("int")
  expires_at: number;

  @OneToMany(
    (type) => CartDetail,
    (cartDetail) => cartDetail.shoppingCart
  )
  cartDetail : CartDetail ;
}