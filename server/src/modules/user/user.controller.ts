import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/types/jwt';
import { UserEntity } from './etities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.userService.create(createUserDto));
  }

  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  async me(@User() user: JwtPayload) {
    return new UserEntity(await this.userService.findUniqueById(user.id));
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findUnique(@Param('id') id: string) {
    return new UserEntity(await this.userService.findUniqueById(+id));
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.userService.update(+id, updateUserDto));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
