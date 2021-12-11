import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("permissions")
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  name: string;

  @Column("varchar")
  code: string;
}
