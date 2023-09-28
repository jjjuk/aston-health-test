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
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { AnalysisSqlService } from './analysis.sql.service';
import { AnalysisTimeStatsQuery, TimeStatEnum } from './query/time-stats.query';
import { EditInterceptor } from '../../common/interceptors/edit.interceptor';

@UseInterceptors(EditInterceptor)
@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly analysisService: AnalysisService,
    private readonly analysisSqlService: AnalysisSqlService,
  ) {}

  @Get()
  findAll() {
    return this.analysisService.findAll();
  }

  @Get('/lab-names')
  groupByLab() {
    return this.analysisService.groupByLab();
  }

  @Post()
  create(@Body() dto: CreateAnalysisDto) {
    return this.analysisService.create(dto);
  }

  @Get(':id')
  findUnique(@Param('id') id: string) {
    return this.analysisService.findUnique(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAnalysisDto) {
    return this.analysisService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analysisService.remove(+id);
  }

  @Get('time-to-complete')
  getTimeToCompleteStat(@Query() query: AnalysisTimeStatsQuery) {
    switch (query.stat as TimeStatEnum) {
      case TimeStatEnum.AVG:
        return this.analysisSqlService.avgTimeToComplete();
      case TimeStatEnum.MEDIAN:
        return this.analysisSqlService.medianTimeToComplete();
      case TimeStatEnum.MODE:
        return this.analysisSqlService.modeTimeToComplete();
      default:
        throw new ForbiddenException('use stat query param');
    }
  }

  @Get('count')
  count() {
    return this.analysisSqlService.count();
  }

  @Get('count-by-region')
  countByRegion() {
    return this.analysisSqlService.countByRegion();
  }
}
