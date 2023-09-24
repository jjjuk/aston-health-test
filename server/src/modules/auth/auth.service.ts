import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { PrismaService } from '../../common/providers/prisma.service';
import { UserAlreadyExists, WrongPassword } from '../../common/errors';
import { JwtPayload } from 'src/types/jwt';

@Injectable()
export class AuthService {
  private readonly fallbackHash =
    '$argon2id$v=19$m=65536,t=3,p=4$OX1IY/aVftg15mz9R10MWQ$Hc/eWyHw/Vnfdnnfy8lC9GiY9n2UGu3waGFiFtWFW4o';
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
    private jwtService: JwtService,
  ) {}

  async signUser(email: string, password: string) {
    const found = await this.user.findUniqueByEmail(email, {
      id: true,
      password: true,
      isAdmin: true,
    });

    if (!found) {
      await argon2.verify(this.fallbackHash, password);
      throw WrongPassword();
    }

    if (!(await argon2.verify(found.password, password))) {
      throw WrongPassword();
    }

    const payload: JwtPayload = { id: found.id, isAdmin: found.isAdmin };

    return this.jwtService.sign(payload);
  }

  async createAndSignUser(email: string, password: string, isAdmin = false) {
    try {
      const created = await this.prisma.user.create({
        data: { email, password: await argon2.hash(password) },
        select: { id: true },
      });

      const payload: JwtPayload = { id: created.id, isAdmin };

      return this.jwtService.sign(payload);
    } catch (err) {
      if (err?.code === 'P2002') throw UserAlreadyExists(email);
      else throw err;
    }
  }
}
