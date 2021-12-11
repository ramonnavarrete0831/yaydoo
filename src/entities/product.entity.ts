import { PointOfSale } from './point-of-sale.entity';
import { Category } from './category.entity';
import { OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProductImage } from './product-image.entity';

import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    Double,
    ManyToMany,
    JoinTable,
  } from "typeorm";
 
  @Entity("products")
  export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    category_id: number;
    
    @Column("varchar")
    friendly_url: string;
    
    @Column("varchar")
    name: string;

    @Column("varchar")
    description: string;

    @Column("decimal")
    price: number;
  
    @Column("int")
    position: number;

    @Column("int")
    available : number;

    @ManyToMany((type) => PointOfSale)
    @JoinTable({
      name: "products_points_of_sale",
      joinColumn: {
        name: "product_id",
        referencedColumnName: "id",
      },
      inverseJoinColumn: {
        name: "points_of_sale_id",
        referencedColumnName: "id",
      },
    })
    pointsOfSale: PointOfSale[];

    @OneToOne((type) => Category)
    @JoinColumn({ name: "category_id", referencedColumnName: "id"})
    category : Category;


    @OneToMany(
      (type) => ProductImage,
      (productImage) => productImage.product
    )
    images : ProductImage ;
  }
  