import { Injectable } from '@nestjs/common';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { PrismaService } from 'src/common/providers/prisma.service';
import { Prisma } from '@prisma/client';
import { differenceInCalendarDays } from 'date-fns';

@Injectable()
export class AnalysisService {
  constructor(private readonly prisma: PrismaService) {}

  create<S extends Prisma.AnalysisSelect>(dto: CreateAnalysisDto, select?: S) {
    return this.prisma.analysis.create({ data: dto, select });
  }

  findUnique<S extends Prisma.AnalysisSelect>(id: number, select?: S) {
    return this.prisma.analysis.findUnique({ where: { id }, select });
  }

  async update<S extends Prisma.AnalysisSelect>(
    id: number,
    dto: UpdateAnalysisDto,
    select?: S,
  ) {
    let completedIn: number | undefined = undefined;
    if (dto.completedAt) {
      const prev = await this.prisma.analysis.findUnique({
        where: { id },
        select: { collectedAt: true },
      });

      completedIn = differenceInCalendarDays(
        new Date(dto.completedAt),
        prev.collectedAt,
      );
    }
    return this.prisma.analysis.update({
      where: { id },
      data: { completedIn, ...dto },
      select,
    });
  }

  remove(id: number) {
    return this.prisma.analysis.delete({ where: { id }, select: { id: true } });
  }
}
