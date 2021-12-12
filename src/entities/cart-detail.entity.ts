import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ShoppingCart } from './shopping-cart.entity';
import { IdPrimaryKey } from './id-primary-key';

@Entity("cart_details")
export class CartDetail extends IdPrimaryKey {

  @Column("int")
  shopping_cart_id: number;

  @Column("int")
  product_id: number;

  @Column("varchar")
  name: string;

  @Column("decimal")
  price: number;

  @Column("int")
  qty: number;

  @Column("decimal")
  total: number;

  @ManyToOne(
    (type) => ShoppingCart,
    (shoppingCart) => shoppingCart.cartDetail
  )
  @JoinColumn({ name: "shopping_cart_id", referencedColumnName: "id" })
  shoppingCart: ShoppingCart;
}
