import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { Permission } from "./permission.entity";
import { IdPrimaryKey } from './id-primary-key';

@Entity("roles")
export class Role extends IdPrimaryKey {

  @Column("varchar")
  role: string;

  @ManyToMany((type) => Permission)
  @JoinTable({
    name: "permissions_roles",
    joinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "permission_id",
      referencedColumnName: "id",
    },
  })
  permissions: Permission[];
}
