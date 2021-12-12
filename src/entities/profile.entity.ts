import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IdPrimaryKey } from './id-primary-key';

@Entity({ name: "profiles" })
export class Profile extends IdPrimaryKey {
  
  @Column("int")
  user_id: number;

  @Column("varchar")
  first_name: string;

  @Column("varchar")
  last_name: string;

  @Column("date")
  birthday: Date;

  @Column("int")
  gender: number;

  @Column("varchar")
  mobile_phone: string;

  @Column("varchar")
  phone: string;

  @Column("varchar")
  uri_picture: string;

  @Column("int")
  registration_day: number;

  @Column("int")
  sms_subscription: number;

  @Column("int")
  email_subscription: number;

  @Column("int")
  push_subscription: number;

  @Column("int")
  pop_subscription: number;

  verified_email: boolean;
}
