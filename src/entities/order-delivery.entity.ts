import { IdPrimaryKey } from './id-primary-key';
import { Column,Entity} from "typeorm";
  
@Entity("order_deliveries")
export class OrderDelivery extends IdPrimaryKey {

    @Column("int")
    order_id: number;

    @Column("int")
    store_id: number;

    @Column("varchar")
    delivery_type: string;

    @Column("int")
    datetime_of_delivery: number;

    @Column("varchar")
    address: string;

    @Column("varchar")
    department: string;

    @Column("varchar")
    lat: string;

    @Column("varchar")
    lng: string;

    @Column("varchar")
    distance_value: string;

    @Column("varchar")
    duration_value: string;

    @Column("int")
    send_request: number;

    @Column("int")
    departure_time: number;

    @Column("varchar")
    whatsapp_id: string;

    @Column("int")
    whatsapp_is_sent: number;
  }
  