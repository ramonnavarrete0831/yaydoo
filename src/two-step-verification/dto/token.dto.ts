import { IsString, MaxLength, MinLength } from "class-validator";

export class TokenDto {
  @IsString()
  @MinLength(36)
  @MaxLength(36)
  token: string;
}
