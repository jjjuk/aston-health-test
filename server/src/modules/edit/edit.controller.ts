import { Controller, Get } from '@nestjs/common';
import { EditService } from './edit.service';

@Controller('edit')
export class EditController {
  constructor(private readonly editService: EditService) {}

  @Get()
  findAll() {
    return this.editService.findAll();
  }
}
