import { IsNotEmpty, Min } from 'class-validator';

export class CartAddItemDto {
  @IsNotEmpty({message:"product_id no puede ir vacío."})
  product_id: number;

  @IsNotEmpty({message:"qty no puede ir vacío."})
  qty: string;
}
