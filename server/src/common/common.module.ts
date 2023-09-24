import { Global, Module } from '@nestjs/common';
import { PrismaService } from './providers/prisma.service';
import { AuthGuard } from './providers/auth.quard';
import { APP_GUARD } from '@nestjs/core';

@Global()
@Module({
  providers: [PrismaService, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [PrismaService],
})
export class CommonModule {}
