import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CartDetail } from './cart-detail.entity';

@Entity("shopping_carts")
export class ShoppingCart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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