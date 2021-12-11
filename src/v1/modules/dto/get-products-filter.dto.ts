import { IsOptional, IsNotEmpty, Min, IsInt } from 'class-validator';

export class GetProductFilterDto {
  @IsOptional()
  @IsNotEmpty()
  product: string;

  @IsOptional()
  @IsNotEmpty()
  sku : string;

  @IsOptional()
  @IsNotEmpty()
  min_price : string;

  @IsOptional()
  @IsNotEmpty()
  max_price : string;

  @IsOptional()
  @IsNotEmpty()
  category: string;

  category_id: number;
}
