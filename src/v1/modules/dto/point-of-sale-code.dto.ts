import { IsString } from 'class-validator';

export class PointOfSaleCodeDto {
  @IsString()
  code: string;
}