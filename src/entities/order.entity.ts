import { Double, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
  } from "typeorm";
import { OrderDetail } from './order-detail.entity';
import { OrderDelivery } from './order-delivery.entity';
  
  @Entity("orders")
  export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column("varchar")
    public_id: string;

    @Column("int")
    code: number;

    @Column("int")
    seller_id: number;

    @Column("int")
    customer_id: number;

    @Column("int")
    created_on: number;

    @Column("decimal")
    subtotal: Double;

    @Column("decimal")
    discount: Double;

    @Column("decimal")
    total: Double;

    @Column("varchar")
    order_status: string;

    @Column("int")
    mycode_id: number;

    @Column("int")
    recomendation: number;

    @Column("int")
    prepared: number;

    @OneToMany(
      (type) => OrderDetail,
      (orderDetail) => orderDetail.order
    )
    orderDetail : OrderDetail ;

    @OneToOne((type) => OrderDelivery)
    @JoinColumn({ name: "id", referencedColumnName: "order_id" })
    orderDelivery: OrderDelivery;
  }
  