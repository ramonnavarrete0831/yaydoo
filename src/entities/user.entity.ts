import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";

import { Profile } from "./profile.entity";
import { Role } from "./role.entity";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  role_id: number;

  @Column("varchar")
  password: string;

  @Column("varchar")
  salt: string;

  @Column("int")
  last_password_update: number;

  @Column("varchar")
  web_push_token: string;

  @Column("varchar")
  mobile_device: string;

  @Column("varchar")
  mobile_push_token: string;

  @Column("int")
  deny_access: number;

  @OneToOne((type) => Profile)
  @JoinColumn({ name: "id", referencedColumnName: "user_id" })
  profile: Profile;


  @OneToOne((type) => Role)
  @JoinColumn({ name: "role_id", referencedColumnName: "id" })
  role: Role;


  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
