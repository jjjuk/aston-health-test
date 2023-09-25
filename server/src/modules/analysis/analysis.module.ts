import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { AnalysisSqlService } from './analysis.sql.service';

@Module({
  controllers: [AnalysisController],
  providers: [AnalysisService, AnalysisSqlService],
})
export class AnalysisModule {}
