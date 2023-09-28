import { Module } from '@nestjs/common';
import { EditService } from './edit.service';
import { EditController } from './edit.controller';

@Module({
  controllers: [EditController],
  providers: [EditService],
})
export class EditModule {}
