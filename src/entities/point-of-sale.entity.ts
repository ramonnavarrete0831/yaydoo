import { IdPrimaryKey } from './id-primary-key';
import {Column, Entity,PrimaryGeneratedColumn} from "typeorm";
  
@Entity("points_of_sale")
export class PointOfSale extends IdPrimaryKey {  
    @Column("varchar")
    code: string;

    @Column("varchar")
    name: string;
}
  