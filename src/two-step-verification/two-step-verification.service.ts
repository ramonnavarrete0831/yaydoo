import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {  IsNull } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { CellPhoneNumberDto } from "./dto/cell-phone-number.dto";
import { TokenRepository } from "./token.repository";
import { ValidationCodeDto } from "./dto/validation-code.dto";
import { UserRepository } from "./user.repository";
import { TokenType } from "./enum/token-type.enum";
import { randomNumber, randomStringNumber } from "../utils/functions";
import { TokenDto } from "./dto/token.dto";
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { SendMessageDto } from '../whatsapp/dto/send-message.dto';
import { PLATAFORM_NAME } from "../config/app.config";

@Injectable()
export class TwoStepVerificationService {
  constructor(
    @InjectRepository(TokenRepository) private tokenRepository: TokenRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private whatsappService: WhatsappService,
  ) {}

  async sendCode(  cellPhoneNumberDto: CellPhoneNumberDto  ): Promise<{time: number;token: string;}> {
    const { cell_phone_number } = cellPhoneNumberDto;

    const sendMessageDto: SendMessageDto =  new SendMessageDto();
    sendMessageDto.phone =`521${cell_phone_number}`;
    sendMessageDto.chatId = `521${cell_phone_number}@c.us`;

    const token = uuidv4();
    const code = randomNumber(5);
    const time = 10 * 60;

    const is_valid = await this.whatsappService.lookup(sendMessageDto);
    if (!is_valid) {
      throw new InternalServerErrorException(
        `Ups! el número de whatsapp  ${cell_phone_number} no es válido.`
      );
    }

    const tokenInsert = await this.tokenRepository.insertToken(
      token,
      code,
      cell_phone_number,
      time
    );

    if (!tokenInsert) {
      throw new InternalServerErrorException(
        `Ups! no pudimos generar el código de verificación, intente nuevamente.`
      );
    }

    sendMessageDto.body=`Nadie de ${PLATAFORM_NAME} te va a solicitar este dato. ¡No lo compartas!\nTu código de seguridad es ${code}, válido por 10 min.`;
    
    const is_sent = await this.whatsappService.sendMessage(sendMessageDto);
    if (!is_sent) {
      throw new InternalServerErrorException(
        `Ups! no pudimos enviar el Whatsapp al número ${cell_phone_number}, intente nuevamente.`
      );
    }

    return {
      time,
      token,
    };
  }

  async validateCode(tokenDto: TokenDto,validationCodeDto: ValidationCodeDto): Promise<{key: string;type: string;expires_at: number;}> {
    const { token } = tokenDto;
    const { validation_code }  = validationCodeDto;

    const tokenResult = await this.tokenRepository.findOne({
      where: {
        id: token,
        process_key: IsNull(),
      },
    });
    
    if (!tokenResult) {
      throw new NotFoundException(
        `Ups! el proceso de verificación no fué encontrado.`
      );
    }

    const { id, timestamp : expire_ad, code } = tokenResult;

    if (expire_ad < Math.floor(Date.now() / 1000)) {
      this.tokenRepository.delete({ id });
      throw new InternalServerErrorException(
        `Ups! se agotó el tiempo de validación.`
      );
    }

    if (code !== validation_code) {
      throw new NotFoundException(
        `Ups! el código de verificación es incorrecto.`
      );
    }

    const process_key = `key_${randomStringNumber(20)}`;

    const userResult = await this.userRepository.findUserByMobilePhone(
      tokenResult.cell_phone_number
    );

    let type = TokenType.USER_REGISTER;
    if (userResult) {
      type = TokenType.RECOVER_PASSWORD;
      if (userResult.deny_access === 1) {
        throw new InternalServerErrorException(
          `Ups! la cuenta de usuario se encuentra bloqueada.`
        );
      }
    }

    const timestamp = Math.floor(Date.now() / 1000) + 20 * 60;

    const tokenUpdate = await this.tokenRepository.update(
      { id },
      { process_key, timestamp, type }
    );

    if (tokenUpdate.affected === 0) {
      throw new InternalServerErrorException(
        `Ups! no pudimos verificar el código, intente nuevamente.`
      );
    }

    return {
      key: process_key,
      type,
      expires_at: timestamp,
    };
  }
}
