import { IdPrimaryKey } from './id-primary-key';
import {Column,Entity} from "typeorm";
  
  @Entity("categories")
  export class Category extends IdPrimaryKey {
    @Column("varchar")
    name: string;

    @Column("varchar")
    friendly_url: string;

    @Column("int")
    available: number;
  }
  