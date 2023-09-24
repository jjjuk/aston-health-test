import { Injectable } from '@nestjs/common';

import { differenceInYears, format } from 'date-fns';

import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/common/providers/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  create<S extends Prisma.PatientSelect>(dto: CreatePatientDto, select?: S) {
    const birthDate = new Date(dto.birthDate);
    const ageOnRegistration = differenceInYears(Date.now(), birthDate);

    let code = dto.surname.charAt(0);
    code += dto.name.charAt(0);
    code += dto.patronymic.charAt(0);
    code += format(birthDate, 'ddMMyyyy');

    return this.prisma.patient.create({
      data: {
        name: dto.name,
        surname: dto.surname,
        patronymic: dto.patronymic,
        birthDate,
        ageOnRegistration,
        gender: dto.gender,
        code,
      },
      select,
    });
  }

  findUnique<S extends Prisma.PatientSelect>(id: number, select?: S) {
    return this.prisma.patient.findUnique({ where: { id }, select });
  }

  async update<S extends Prisma.PatientSelect>(
    id: number,
    dto: UpdatePatientDto,
    select?: S,
  ) {
    const birthDate = dto.birthDate ? new Date(dto.birthDate) : undefined;
    const ageOnRegistration = birthDate
      ? differenceInYears(Date.now(), birthDate)
      : undefined;

    let code: string | undefined = undefined;

    if (dto.birthDate || dto.name || dto.patronymic || dto.surname) {
      code = dto.surname.charAt(0);
      code += dto.name.charAt(0);
      code += dto.patronymic.charAt(0);
      if (!birthDate) {
        const { birthDate: prevBirthDate } =
          await this.prisma.patient.findUniqueOrThrow({
            where: { id },
            select: { birthDate: true },
          });
        code += format(prevBirthDate, 'ddMMyyyy');
      } else {
        code += format(birthDate, 'ddMMyyyy');
      }
    }

    return await this.prisma.patient.update({
      where: { id },
      data: {
        name: dto.name,
        surname: dto.surname,
        patronymic: dto.patronymic,
        birthDate,
        ageOnRegistration,
        gender: dto.gender,
        code,
      },
      select,
    });
  }

  remove(id: number) {
    return this.prisma.patient.delete({ where: { id }, select: { id: true } });
  }
}
