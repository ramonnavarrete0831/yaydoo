import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy } from "passport-anonymous";

import { UserRepository } from "./user.repository";

@Injectable()
export class AnonymousStrategy extends PassportStrategy(Strategy, "anonymous") {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {
    super();
  }
}
