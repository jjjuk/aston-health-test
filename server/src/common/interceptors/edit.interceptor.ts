import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify/types/request';

import { Observable } from 'rxjs';
import { PrismaService } from 'src/common/providers/prisma.service';

@Injectable()
export class EditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    if (req.method !== 'GET') {
      await this.prisma.edit.create({
        data: {
          date: new Date(),
          model: req.originalUrl,
          operation: req.method,
          arguments: JSON.stringify(req.body || {}),
          User: { connect: { id: req.user.id } },
        },
        select: { id: true },
      });
    }
    return next.handle();
  }
}
