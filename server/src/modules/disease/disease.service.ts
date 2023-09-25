import { Injectable } from '@nestjs/common';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/providers/prisma.service';

@Injectable()
export class DiseaseService {
  constructor(private readonly prisma: PrismaService) {}

  create<S extends Prisma.DiseaseSelect>(dto: CreateDiseaseDto, select?: S) {
    return this.prisma.disease.create({ data: dto, select });
  }

  fulltextSearch<S extends Prisma.DiseaseSelect>(query: string, select?: S) {
    return this.prisma.disease.findMany({
      where: { name: { search: query } },
      select,
    });
  }

  findUnique<S extends Prisma.DiseaseSelect>(id: number, select?: S) {
    return this.prisma.disease.findUnique({ where: { id }, select });
  }

  update<S extends Prisma.DiseaseSelect>(
    id: number,
    dto: UpdateDiseaseDto,
    select?: S,
  ) {
    return this.prisma.disease.update({ where: { id }, data: dto, select });
  }

  remove(id: number) {
    return this.prisma.disease.delete({ where: { id }, select: { id: true } });
  }
}
