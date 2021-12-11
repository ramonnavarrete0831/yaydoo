import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("tokens")
export class Token extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column("varchar")
  code: string;

  @Column("varchar")
  process_key: string;

  @Column("varchar")
  type: string;

  @Column("varchar")
  cell_phone_number: string;

  @Column("int")
  timestamp: number;
}
