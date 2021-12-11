import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
  } from "typeorm";
  
@Entity("points_of_sale")
export class PointOfSale extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column("varchar")
    code: string;

    @Column("varchar")
    name: string;
}
  