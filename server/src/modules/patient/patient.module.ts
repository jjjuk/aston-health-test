import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { ContactInfoModule } from './modules/contact-info/contact-info.module';
import { RouterModule } from '@nestjs/core';
import { PatientSqlService } from './patient.sql.service';

@Module({
  imports: [
    ContactInfoModule,
    RouterModule.register([
      {
        path: 'patient/:id',
        module: ContactInfoModule,
      },
    ]),
  ],
  controllers: [PatientController],
  providers: [PatientService, PatientSqlService],
})
export class PatientModule {}
