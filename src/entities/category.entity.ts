import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
  } from "typeorm";
  
  @Entity("categories")
  export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column("varchar")
    name: string;

    @Column("varchar")
    friendly_url: string;

    @Column("int")
    available: number;
  }
  