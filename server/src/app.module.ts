import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { DiseaseModule } from './modules/disease/disease.module';
import { AnalysisModule } from './modules/analysis/analysis.module';

@Module({
  imports: [UserModule, AnalysisModule, DiseaseModule],
})
export class AppModule {}
