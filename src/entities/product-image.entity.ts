import { ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
  } from "typeorm";
  
  @Entity("product_images")
  export class ProductImage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column("int")
    product_id: number;

    @Column("varchar")
    uri: string;

    @ManyToOne(
        (type) => Product,
        (product) => product.images
    )
    @JoinColumn({ name: "product_id", referencedColumnName: "id" })
    product: Product;
  
}
  