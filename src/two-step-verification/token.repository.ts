import { Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";

import { Token } from "../entities/token.entity";

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {
  private logger = new Logger("TokenRepository");

  async insertToken(token: string,code: string,cell_phone_number: string,time: number): Promise<boolean> {
    const query = this.createQueryBuilder()
      .insert()
      .into(Token)
      .values([
        {
          id: token,
          code,
          cell_phone_number,
          timestamp: Math.floor(Date.now() / 1000) + time,
        },
      ]);

    try {
      await query.execute();
      return true;
    } catch (error) {
      this.logger.error(
        `Error al realizar la consulta ${JSON.stringify(query.getQuery())}`,
        error.stack
      );
    }
  }
}
