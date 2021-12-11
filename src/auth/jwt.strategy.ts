import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from "passport-jwt";

import { JwtPayload } from "./jwt-payload.interface";
import { UserRepository } from "./user.repository";
import { User } from "../entities/user.entity";
import { JWT_SECRET } from "../config/app.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { last_password_update } = payload;
    const userResult = await this.userRepository.validateJwt(payload);
    if (!userResult) {
      throw new UnauthorizedException(
        `Ups! el acceso al recurso  fué denegado.`
      );
    }

    if (userResult.deny_access === 1) {
      throw new UnauthorizedException(
        `Ups! la cuenta de usuario se encuentra bloqueada.`
      );
    }

    if (last_password_update !== userResult.last_password_update) {
      throw new UnauthorizedException(
        `Ups! la contraseña fué actualizada desde otro dispositivo.`
      );
    }
    
    return userResult;
  }
}
