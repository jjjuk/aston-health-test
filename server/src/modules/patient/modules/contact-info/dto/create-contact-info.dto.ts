import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateContactInfoDto {
  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  fedDist: string;

  @IsOptional()
  @IsString()
  region: string;

  @IsOptional()
  @IsString()
  area: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  settlement: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  phones: string;

  @IsString()
  familyPhones: string;
}
