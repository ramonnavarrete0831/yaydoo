import { IsNotEmpty, ValidateNested, IsNumberString, IsString } from 'class-validator';
import { Type } from "class-transformer";

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  author: string;
  
  @IsString()
  @IsNotEmpty()
  chatId: string;
}

export class whatsappDto {
  @IsNumberString()
  @IsNotEmpty()
  instanceId:number;

  @Type(() => MessageDto)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  messages: MessageDto[];
}