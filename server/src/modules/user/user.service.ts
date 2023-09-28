import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/providers/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create<S extends Prisma.UserSelect>(dto: CreateUserDto, select?: S) {
    return this.prisma.user.create({ data: dto, select });
  }

  findUniqueById<S extends Prisma.UserSelect>(id: number, select?: S) {
    return this.prisma.user.findUniqueOrThrow({ where: { id }, select });
  }

  findUniqueByEmail<S extends Prisma.UserSelect>(email: string, select?: S) {
    return this.prisma.user.findUnique({ where: { email }, select });
  }

  update<S extends Prisma.UserSelect>(
    id: number,
    dto: UpdateUserDto,
    select?: S,
  ) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
      select: { id: true },
    });
  }
}
