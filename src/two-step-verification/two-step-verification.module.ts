import { Module, HttpModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TwoStepVerificationController } from "./two-step-verification.controller";
import { TwoStepVerificationService } from "./two-step-verification.service";
import { TokenRepository } from "./token.repository";
import { UserRepository } from "./user.repository";
import { AuthModule } from "../auth/auth.module";
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
    }),
    TypeOrmModule.forFeature([TokenRepository, UserRepository]),
    AuthModule,
  ],
  controllers: [TwoStepVerificationController],
  providers: [TwoStepVerificationService, WhatsappService],
})
export class TwoStepVerificationModule {}
