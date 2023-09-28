import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
  UseInterceptors,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CountPatientQuery } from './query/count.query';
import { PatientSqlService } from './patient.sql.service';
import { EditInterceptor } from '../../common/interceptors/edit.interceptor';

@UseInterceptors(EditInterceptor)
@Controller('patient')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly patientSqlService: PatientSqlService,
  ) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get(':id')
  findUnique(@Param('id') id: string) {
    return this.patientService.findUnique(+id);
  }

  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientService.remove(+id);
  }

  @Get('count')
  count() {
    return this.patientSqlService.count();
  }

  @Get('count-by')
  countBy(@Query() query: CountPatientQuery) {
    if (!query.disease === !query.region)
      throw new ForbiddenException('either use by_region or by_disease');

    if (query.disease) return this.patientSqlService.countByDisease();
    if (query.region) return this.patientSqlService.countByRegion();
  }

  @Get('list-analysis-count')
  listByAnalysisCount() {
    return this.patientSqlService.listByAnalysisCount();
  }

  @Get('list-youngest-analysis')
  listByYoungestAnalysis() {
    return this.patientSqlService.listByYoungestAnalysis();
  }

  @Get('list-with-diseases')
  listWithDiseases() {
    return this.patientSqlService.listWithDiseases();
  }
}
