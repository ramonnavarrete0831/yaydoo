import { Controller, Logger, Get } from '@nestjs/common';
import { PointOfSaleService } from './point-of-sale.service';
import { PointOfSale } from '../../../entities/point-of-sale.entity';

@Controller('point-of-sale')
export class PointOfSaleController {
    private logger = new Logger("PointOfSaleController");
    constructor(private pointOfSaleService:PointOfSaleService) {}

    @Get("/list")
    async list(): Promise<{pointsOfSale:PointOfSale[]}>{
        this.logger.verbose(`Petición para obtener la lista de puntos de venta.`);
        const pointsOfSale = await this.pointOfSaleService.list();
        return {pointsOfSale};
    }
}
