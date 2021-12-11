import { IsNumberString, Length } from "class-validator";

export class CellPhoneNumberDto {
  @Length(10, 10, {
    message: `Ups! el número celular debe tener 10 dígitos.`,
  })
  @IsNumberString(null, {
    message: `Ups! el número celular no parece ser correcto.`,
  })
  cell_phone_number: string;
}
