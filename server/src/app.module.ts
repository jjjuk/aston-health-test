import { Module } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PatientModule } from './modules/patient/patient.module';
import { ContactInfoModule } from './modules/contact-info/contact-info.module';
import { DiseaseModule } from './modules/disease/disease.module';
import { AnalysisModule } from './modules/analysis/analysis.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    PatientModule,
    AnalysisModule,
    DiseaseModule,
    ContactInfoModule,
  ],
})
export class AppModule {}
