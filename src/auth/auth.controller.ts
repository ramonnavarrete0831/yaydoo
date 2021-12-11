import { Controller, Post, Body, ValidationPipe, Logger } from '@nestjs/common';

import { AuthtCredentialsDto } from "./dto/auth-credentials.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  private logger = new Logger("AuthController");
  constructor(private authService: AuthService) {}

  @Post("/sign-in")
  async signIn(
    @Body(ValidationPipe) authtCredentialsDto: AuthtCredentialsDto
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(`Petición para crear el JWT`);
    return this.authService.signIn(authtCredentialsDto);
  }
}
