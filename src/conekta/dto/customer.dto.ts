import { CardDto } from "./card.dto";
export class CustomerDto {
  id: string;

  name: string;

  email: string;

  phone: string;

  error: any;

  card?: CardDto = new CardDto();
}
