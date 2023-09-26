import { Injectable } from '@nestjs/common';

import { differenceInYears } from 'date-fns';

import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/common/providers/prisma.service';
import { Prisma } from '@prisma/client';
import { createPatientCode } from 'src/utils/patient-code';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  create<S extends Prisma.PatientSelect>(dto: CreatePatientDto, select?: S) {
    const birthDate = new Date(dto.birthDate);
    const ageOnRegistration = differenceInYears(Date.now(), birthDate);

    return this.prisma.patient.create({
      data: {
        name: dto.name,
        surname: dto.surname,
        patronymic: dto.patronymic,
        birthDate,
        ageOnRegistration,
        gender: dto.gender,
        code: createPatientCode(
          dto.surname,
          dto.name,
          dto.patronymic,
          birthDate,
        ),
      },
      select,
    });
  }

  findUnique<S extends Prisma.PatientSelect>(id: number, select?: S) {
    return this.prisma.patient.findUnique({ where: { id }, select });
  }

  findAll<S extends Prisma.PatientSelect>(select?: S) {
    return this.prisma.patient.findMany({ select });
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

    if (birthDate || dto.name || dto.patronymic || dto.surname) {
      if (birthDate && dto.name && dto.patronymic && dto.surname) {
        code = createPatientCode(
          dto.surname,
          dto.name,
          dto.patronymic,
          birthDate,
        );
      } else {
        const prev = await this.prisma.patient.findUniqueOrThrow({
          where: { id },
          select: {
            birthDate: !birthDate,
            surname: !dto.surname,
            name: !dto.name,
            patronymic: !dto.patronymic,
          },
        });

        code = createPatientCode(
          dto.surname ? dto.surname : prev.surname,
          dto.name ? dto.name : prev.name,
          dto.patronymic ? dto.patronymic : prev.patronymic,
          birthDate ? birthDate : prev.birthDate,
        );
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
