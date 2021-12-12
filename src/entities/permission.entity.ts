import {  Column, Entity } from "typeorm";
import { IdPrimaryKey } from './id-primary-key';

@Entity("permissions")
export class Permission extends IdPrimaryKey {

  @Column("varchar")
  name: string;

  @Column("varchar")
  code: string;
}
