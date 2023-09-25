import { Injectable } from '@nestjs/common';
import { CreateContactInfoDto } from './dto/create-contact-info.dto';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { PrismaService } from 'src/common/providers/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContactInfoService {
  constructor(private readonly prisma: PrismaService) {}

  create<S extends Prisma.ContactInfoSelect>(
    patientId: number,
    dto: CreateContactInfoDto,
    select?: S,
  ) {
    return this.prisma.contactInfo.create({
      data: { patientId, ...dto },
      select,
    });
  }

  update<S extends Prisma.ContactInfoSelect>(
    patientId: number,
    dto: UpdateContactInfoDto,
    select?: S,
  ) {
    return this.prisma.contactInfo.update({
      where: { patientId },
      data: dto,
      select,
    });
  }

  remove(patientId: number) {
    return this.prisma.contactInfo.delete({
      where: { patientId },
      select: { patientId: true },
    });
  }
}
