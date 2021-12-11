import { IsIn, IsNotEmpty } from 'class-validator';
import { PaymentType } from '../enum/payment-type.enum';
export class OrderInfoDto {
    @IsNotEmpty({message:"Ups! la dirección de entrega no puede estar vacía."})
    address : string;

    @IsIn([PaymentType.CASH,PaymentType.OXXO,PaymentType.SPEI], {
        message: `Ups! los tipos de pago pueden ser ${PaymentType.CASH}, ${PaymentType.OXXO} o ${PaymentType.SPEI}.`,
    })
    payment_type: string;
}