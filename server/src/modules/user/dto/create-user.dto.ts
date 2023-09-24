import { IsEmail, IsOptional, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsStrongPassword({ minLength: 8, minSymbols: 0, minUppercase: 0 })
  password: string;

  @IsOptional()
  name: string;
}
