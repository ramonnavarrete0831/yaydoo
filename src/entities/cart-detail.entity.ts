import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Double, ManyToOne, JoinColumn } from 'typeorm';
import { ShoppingCart } from './shopping-cart.entity';

@Entity("cart_details")
export class CartDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  shopping_cart_id: number;

  @Column("int")
  product_id: number;

  @Column("varchar")
  name: string;

  @Column("decimal")
  price: Double;

  @Column("int")
  qty: number;

  @Column("decimal")
  total: Double;

  @ManyToOne(
    (type) => ShoppingCart,
    (shoppingCart) => shoppingCart.cartDetail
  )
  @JoinColumn({ name: "shopping_cart_id", referencedColumnName: "id" })
  shoppingCart: ShoppingCart;
}
