import { CustomerDto } from "./customer.dto";
import { CardDto } from "./card.dto";
import { PaymentDto } from "./payment.dto";

export class OrderDto {
  id: string;

  order_id: number;

  payment_status: string;

  type?: string = "oxxo_cash";

  amount: number;

  customer?: CustomerDto = new CustomerDto();

  card?: CardDto = new CardDto();

  payment?: PaymentDto = new PaymentDto();

  error: any;
}
