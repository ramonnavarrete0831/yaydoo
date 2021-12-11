import {
  Body,
  Controller,
  ValidationPipe,
  Logger,
  Param,
  Post,
} from "@nestjs/common";

import { CellPhoneNumberDto } from "./dto/cell-phone-number.dto";
import { TwoStepVerificationService } from "./two-step-verification.service";
import { ValidationCodeDto } from "./dto/validation-code.dto";
import { TokenDto } from "./dto/token.dto";

@Controller("two-step-verification")
export class TwoStepVerificationController {
  private logger = new Logger("TwoStepVerificationController");

  constructor(private twoStepVerificationService: TwoStepVerificationService, ){}

  @Post("send-whatsapp")
  async sendSms( @Body(ValidationPipe) cellPhoneNumberDto: CellPhoneNumberDto): Promise<{time: number;token: string;}>{
    this.logger.verbose(
      `realiza petición para envío de código de verificación por Whatsapp, filter: ${JSON.stringify(
        cellPhoneNumberDto
      )}`
    );
    return this.twoStepVerificationService.sendCode(cellPhoneNumberDto);
  }

  @Post("/:token")
  async validateCode(@Param(ValidationPipe) tokenDto: TokenDto, @Body(ValidationPipe) validationCodeDto: ValidationCodeDto): Promise<{key: string;type: string;expires_at: number;}> {
    this.logger.verbose(
      `realiza petición para verificación de código, code: ${JSON.stringify(
        validationCodeDto
      )}, token : ${JSON.stringify(tokenDto)}`
    );
    return this.twoStepVerificationService.validateCode(
      tokenDto,
      validationCodeDto
    );
  }
}
