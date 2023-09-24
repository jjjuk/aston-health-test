import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import cfg from 'src/config/app.config';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: cfg.jwtSecret,
    }),
  ],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
