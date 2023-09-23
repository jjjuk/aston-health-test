import jwt, { JwtPayload } from 'jsonwebtoken';
declare module 'jsonwebtoken' {
  interface JwtPayload {
    id: number;
  }
}
import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';

import { PrismaService } from './prisma.service';
import { TokenVerificationError, WrongPassword } from './errors';
import cfg from 'src/config/app.config';

@Injectable()
export class AuthService {
  private readonly fallbackHash =
    '$argon2id$v=19$m=65536,t=3,p=4$OX1IY/aVftg15mz9R10MWQ$Hc/eWyHw/Vnfdnnfy8lC9GiY9n2UGu3waGFiFtWFW4o';
  constructor(private readonly prisma: PrismaService) {}

  async signUser(email: string, password: string) {
    const found = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });

    if (!found) {
      await argon2.verify(this.fallbackHash, password);
      throw WrongPassword();
    }

    if (!(await argon2.verify(found.password, password))) {
      throw WrongPassword();
    }

    return jwt.sign({ id: found.id }, cfg.jwtSecret);
  }

  async verifyToken(token: string) {
    try {
      return jwt.verify(token, cfg.jwtSecret) as JwtPayload;
    } catch {
      throw TokenVerificationError();
    }
  }
}
