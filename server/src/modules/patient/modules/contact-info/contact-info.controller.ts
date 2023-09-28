import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ContactInfoService } from './contact-info.service';
import { CreateContactInfoDto } from './dto/create-contact-info.dto';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { EditInterceptor } from 'src/common/interceptors/edit.interceptor';

@UseInterceptors(EditInterceptor)
@Controller('contact-info')
export class ContactInfoController {
  constructor(private readonly contactInfoService: ContactInfoService) {}

  @Post()
  create(@Param('id') patientId: string, @Body() dto: CreateContactInfoDto) {
    return this.contactInfoService.create(+patientId, dto);
  }

  @Get()
  findUnique(@Param('id') patientId: string) {
    return this.contactInfoService.findUnique(+patientId);
  }

  @Patch()
  update(
    @Param('id') patientId: string,
    @Body() updateContactInfoDto: UpdateContactInfoDto,
  ) {
    return this.contactInfoService.update(+patientId, updateContactInfoDto);
  }

  @Delete()
  remove(@Param('id') patientId: string) {
    return this.contactInfoService.remove(+patientId);
  }
}
