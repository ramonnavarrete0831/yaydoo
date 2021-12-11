import { Injectable } from '@nestjs/common';
import { PointOfSale } from '../../../entities/point-of-sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PointOfSaleRepository } from '../../repository/point-of-sale.repository';

@Injectable()
export class PointOfSaleService {

    constructor(
        @InjectRepository(PointOfSaleRepository) private pointOfSaleRepository: PointOfSaleRepository
    ) {}

    async list():Promise<PointOfSale[]>{
        const pointsOfSaleResult = await this.pointOfSaleRepository.findPointsOfSale();
        return pointsOfSaleResult;
    }
}
