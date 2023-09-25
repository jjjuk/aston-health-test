import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/common/providers/prisma.service';

@Injectable()
export class AnalysisSqlService {
  constructor(private readonly prisma: PrismaService) {}

  //==============================================================
  //===================[тут пошли эскуэлки]=======================
  //==============================================================

  async count() {
    const [result] = (await this.prisma.$queryRaw`
      SELECT COUNT(Analysis.id) AS count 
      FROM Analysis
    `) as any[];
    return result;
  }

  async countByRegion() {
    const result = (await this.prisma.$queryRaw`
      SELECT ContactInfo.region, COUNT(Analysis.id) AS count
      FROM Analysis
      LEFT JOIN Patient ON Patient.id = Analysis.patientId
      LEFT JOIN ContactInfo ON Patient.id = ContactInfo.patientId
      GROUP BY ContactInfo.region
      ORDER BY count DESC
    `) as any[];
    return result;
  }

  async avgTimeToComplete() {
    const [result] = (await this.prisma.$queryRaw`
      SELECT AVG(Analysis.completedIn) AS avg 
      FROM Analysis
    `) as any[];
    return result;
  }

  async medianTimeToComplete() {
    await this.prisma.$executeRaw`
      SET @rowindex := -1
    `;
    const [result] = (await this.prisma.$queryRaw`
      SELECT AVG(a.completedIn) AS median 
      FROM
        (SELECT 
          @rowindex:=@rowindex + 1 AS rowindex,
          Analysis.completedIn AS completedIn
        FROM Analysis
        ORDER BY Analysis.completedIn) AS a
      WHERE
        a.rowindex IN (FLOOR(@rowindex / 2), CEIL(@rowindex / 2))
    `) as [{ median: Decimal }]; //prisma конвертирует этот результат в Decimal
    return { median: result.median.toNumber() };
  }

  async modeTimeToComplete() {
    const [result] = (await this.prisma.$queryRaw`
    SELECT Analysis.completedIn AS mode 
    FROM Analysis
    GROUP BY Analysis.completedIn
    ORDER BY COUNT(Analysis.completedIn) DESC
    LIMIT 1
  `) as any[];
    return result;
  }
}
