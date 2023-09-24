import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { NoGuards } from 'src/common/decorators/no-guards.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @NoGuards()
  @Post('login')
  login(@Body() dto: CreateUserDto) {
    return this.authService.signUser(dto.email, dto.password);
  }

  @NoGuards()
  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.createAndSignUser(dto.email, dto.password);
  }
}
