import { IsNumberString, IsString } from 'class-validator';
export class FriendlyUrlDto {
  @IsString()
  friendly_url : string;
}