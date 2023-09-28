import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';

@Injectable()
export class EditService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.edit.findMany({
      select: {
        id: true,
        date: true,
        model: true,
        operation: true,
        arguments: true,
        User: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }
}
