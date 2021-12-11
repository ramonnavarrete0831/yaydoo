import { IsOptional, IsNotEmpty} from 'class-validator';

export class PaginationDto {
    
  @IsOptional()
  @IsNotEmpty()
  page: string;

  @IsOptional()
  @IsNotEmpty()
  limit: string;

  route : string;
}