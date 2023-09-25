import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import Fastify from 'fastify';
import cfg from './config/app.config';

export async function bootstrap() {
  const fastify = Fastify().setReplySerializer(function (payload) {
    return JSON.stringify(payload, (_, value) =>
      // для тестового пойдет
      typeof value === 'bigint' ? Number(value) : value,
    );
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastify),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(cfg.port);
}
bootstrap();
