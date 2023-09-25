import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';

@Injectable()
export class PatientSqlService {
  constructor(private readonly prisma: PrismaService) {}

  //==============================================================
  //===================[тут пошли эскуэлки]=======================
  //==============================================================

  async count() {
    const [result] = (await this.prisma.$queryRaw`
      SELECT COUNT(Patient.id) AS count 
      FROM Patient
    `) as any[];
    return result;
  }

  async countByDisease() {
    const result = (await this.prisma.$queryRaw`
      SELECT Disease.name, COUNT(Patient.id) AS count
      FROM Patient
      LEFT JOIN Disease ON Patient.id = Disease.patientId
      GROUP BY Disease.name
      ORDER BY count DESC
    `) as any[];
    return result;
  }

  async countByRegion() {
    const result = (await this.prisma.$queryRaw`
      SELECT ContactInfo.region, COUNT(Patient.id) AS count
      FROM Patient
      LEFT JOIN ContactInfo ON Patient.id = ContactInfo.patientId
      GROUP BY ContactInfo.region
      ORDER BY count DESC
    `) as any[];
    return result;
  }

  async listByAnalysisCount() {
    await this.prisma.$executeRaw`
      SET @rowindex := 0
    `;
    const result = (await this.prisma.$queryRaw`
      SELECT @rowindex:=@rowindex+1 AS n, p.*
      FROM 
        (SELECT 
        Patient.id as id,
        CONCAT(Patient.surname,' ', Patient.name) AS fi, 
        CONCAT(Patient.surname, ' ', Patient.name, ' ', Patient.patronymic) AS fio, 
        COUNT(Analysis.id) AS analysisCount
        FROM Patient
        LEFT JOIN Analysis ON Patient.id = Analysis.patientId
        GROUP BY Analysis.patientId, Patient.id
        ORDER BY analysisCount DESC) as p
    `) as any[];
    return result;
  }

  async listByYoungestAnalysis() {
    const result = (await this.prisma.$queryRaw`
      SELECT 
        Patient.id,
        CONCAT(Patient.surname, ' ', Patient.name, ' ', Patient.patronymic) AS fio,
        DATE_FORMAT(
          CONVERT_TZ(Patient.birthDate, '+00:00', '+03:00'), 
          "%d.%m.%Y") as birthDate,
        DATE_FORMAT(
          CONVERT_TZ(MIN(Analysis.collectedAt), '+00:00', '+03:00'), 
          "%d.%m.%Y") as firstAnalysisDate
      FROM Patient
      INNER JOIN Analysis ON Patient.id = Analysis.patientId
      GROUP BY Analysis.patientId, Patient.id
      ORDER BY DATEDIFF(MIN(Analysis.collectedAt), Patient.birthDate) ASC
    `) as any[];
    return result;
  }

  async listWithDiseases() {
    const result = (await this.prisma.$queryRaw`
      SELECT 
        Patient.*,
        IF(COUNT(Disease.id) = 0, JSON_ARRAY(),
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', Disease.id,
              'patientId', Disease.patientId,
              'diagnosedAt', Disease.diagnosedAt,
              'name', Disease.name
            )
          )
        ) as diseases
      FROM Patient
      LEFT JOIN Disease ON Patient.id = Disease.patientId
      GROUP BY Disease.patientId, Patient.id
    `) as any[];
    return result;
  }
}
