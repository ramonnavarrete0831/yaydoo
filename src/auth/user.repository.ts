import { Logger, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";

import { User } from "../entities/user.entity";
import { AuthtCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtPayload } from "./jwt-payload.interface";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger("UserRepository");

  async validateUserPassword( authtCredentialsDto: AuthtCredentialsDto ): Promise<User> {
    const { username: mobile_phone, password } = authtCredentialsDto;

    const query = this.createQueryBuilder("User")
      .innerJoinAndSelect("User.profile", "Profile")
      .innerJoinAndSelect("User.role", "Role")
      .select([
        "User.id",
        "User.role_id",
        "User.password",
        "User.salt",
        "User.last_password_update",
        "Role.role",
      ])
      .where(
        "Profile.mobile_phone = :mobile_phone and User.deny_access = 0",
        {
          mobile_phone,
        }
      );

    try {
      const user = await query.getOne();
      if (user && (await user.validatePassword(password))) {
        return user;
      }
    } catch (error) {
      this.logger.error(
        `Error al realizar la consulta ${query.getQuery()}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async validateJwt(payload: JwtPayload): Promise<User> {
    const { role_id, id  } = payload;
   
    const query = this.createQueryBuilder("User")
      .innerJoinAndSelect("User.profile", "Profile")
      .innerJoinAndSelect("User.role", "Role")
      .leftJoinAndSelect("Role.permissions", "Permissions")
      .select([
        "User.id",
        "User.last_password_update",
        "User.deny_access",
        "Profile.first_name",
        "Profile.last_name",
        "Profile.mobile_phone",
        "Role.id",
        "Permissions.code",
      ])
      .where(
        "User.id = :id and User.role_id = :role_id",
        {
          id,
          role_id,
        }
      );

    try {
      return await query.getOne();
    } catch (error) {
      this.logger.error(
        `Error al realizar la consulta ${query.getQuery()}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }
}
