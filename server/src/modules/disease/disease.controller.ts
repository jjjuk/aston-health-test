import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { DiseaseService } from './disease.service';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import { EditInterceptor } from '../../common/interceptors/edit.interceptor';

@UseInterceptors(EditInterceptor)
@Controller('disease')
export class DiseaseController {
  constructor(private readonly diseaseService: DiseaseService) {}

  @Post()
  create(@Body() createDiseaseDto: CreateDiseaseDto) {
    return this.diseaseService.create(createDiseaseDto);
  }

  @Get('/search')
  search(@Query('q') query?: string) {
    return this.diseaseService.fulltextSearch(query);
  }

  @Get()
  findAll() {
    return this.diseaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diseaseService.findUnique(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiseaseDto: UpdateDiseaseDto) {
    return this.diseaseService.update(+id, updateDiseaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diseaseService.remove(+id);
  }
}
