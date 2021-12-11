import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";

import { UserRepository } from "./user.repository";
import { AuthtCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "../entities/user.entity";
import { MobileDevice } from "./enum/mobile-device.enum";

@Injectable()
export class AuthService {
 
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signIn(
    authtCredentialsDto: AuthtCredentialsDto
  ): Promise<{ accessToken: string }> {
    const { mobile_device, mobile_push_token } = authtCredentialsDto;
    const userResult: User = await this.userRepository.validateUserPassword(
      authtCredentialsDto
    );

    if (!userResult) {
      throw new UnauthorizedException(
        `Ups! las credenciales proporcionadas son incorrectas.`
      );
    }

    const { id, role_id, last_password_update, role:{ role } } = userResult;

    if (mobile_device && mobile_push_token) {
      await this.userRepository.update(
        { id },
        { mobile_device, mobile_push_token }
      );
    }

    let expiresIn = 3600 * 24 ;
    let device = "WEB-BROWSER";

    if (
      mobile_device === MobileDevice.ANDROID ||
      mobile_device === MobileDevice.iOS
    ) {
      expiresIn = 3600 * 24 * 90;
      device = "PHONE";
    }

    const payload: JwtPayload = {
      id,
      role_id,
      role,
      last_password_update,
      device,
    };
    
    const accessToken = await this.jwtService.sign(payload, {
      expiresIn,
    });
    
    return { accessToken };
  }
}
