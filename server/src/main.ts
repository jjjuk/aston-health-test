import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import Fastify from 'fastify';
import cors from '@fastify/cors';

import { AppModule } from './app.module';
import cfg from './config/app.config';

export async function bootstrap() {
  const fastify = Fastify();

  fastify.setReplySerializer(function (payload) {
    return JSON.stringify(payload, (_, value) =>
      // для тестового пойдет
      typeof value === 'bigint' ? Number(value) : value,
    );
  });

  fastify.register(cors, {
    origin: '*',
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastify),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(cfg.port, '0.0.0.0');
}
bootstrap();
