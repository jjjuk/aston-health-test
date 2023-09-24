import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

export const WrongPassword = () => new ForbiddenException('wrong password');

export const TokenVerificationError = () =>
  new UnauthorizedException('invalid token');

export const UserAlreadyExists = (email: string) =>
  new ConflictException(`user with email ${email} already exists`);
