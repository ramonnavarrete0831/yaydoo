import { EntityRepository, Repository } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { PointOfSale } from '../../entities/point-of-sale.entity';

@EntityRepository(PointOfSale)
export class PointOfSaleRepository extends Repository<PointOfSale> {
    private logger = new Logger("PointOfSaleRepository");

    async findPointsOfSale(): Promise<PointOfSale[]> {
        const query = this.createQueryBuilder("PointOfSale")
        .select([
          "PointOfSale.id",
          "PointOfSale.name",
        ])
        .orderBy("PointOfSale.id","ASC");

        try {
          return await query.getMany();
        } catch (error) {
          this.logger.error(
            `Error al realizar la consulta ${query.getQuery()}`,
            error.stack
          );
          throw new InternalServerErrorException();
        }
    }
}