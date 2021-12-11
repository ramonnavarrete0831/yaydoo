import { IsNumberString, Length } from "class-validator";

export class ValidationCodeDto {
  @Length(5, 5, {
    message: `Ups! el código de verificación debe tener 5 dígitos.`,
  })
  @IsNumberString(null, {
    message: `Ups! el código de verificación es incorrecto.`,
  })
  validation_code: string;
}
