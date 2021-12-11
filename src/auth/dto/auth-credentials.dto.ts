import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

import { MobileDevice } from "../enum/mobile-device.enum";

export class AuthtCredentialsDto {
  @Length(10, 10, {
    message: `Ups! el número celular debe tener 10 dígitos.`,
  })
  @IsNumberString(null, {
    message: `Ups! el número celular no parece ser correcto.`,
  })
  username: string;

  @IsNotEmpty({
    message: `Ups! la contraseña no puede estar vacía.`,
  })
  password: string;

  @IsString()
  @IsOptional()
  @IsIn([MobileDevice.iOS, MobileDevice.ANDROID], {
    message: `Ups! los dispositivos soportados son ${MobileDevice.ANDROID} o  ${MobileDevice.iOS}.`,
  })
  mobile_device: string;

  @IsString()
  @IsOptional()
  mobile_push_token: string;
}
