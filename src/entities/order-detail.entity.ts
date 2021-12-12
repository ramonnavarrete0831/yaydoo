import { Double, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { IdPrimaryKey } from './id-primary-key';
import {Column,Entity} from "typeorm";
  
@Entity("order_details")
export class OrderDetail extends IdPrimaryKey {

    @Column("int")
    order_id: number;

    @Column("int")
    product_id: number;

    @Column("varchar")
    name: string;

    @Column("varchar")
    description: string;

    @Column("decimal")
    unit_price: Double;
    
    @Column("int")
    qty: number;

    @Column("decimal")
    subtotal: Double;

    @Column("decimal")
    discount: Double;

    @Column("decimal")
    total: Double;

    @Column("int")
    prepared: number;

    @ManyToOne(
        (type) => Order,
        (order) => order.orderDetail
      )
    @JoinColumn({ name: "order_id", referencedColumnName: "id" })
    order: Order;
  }
  