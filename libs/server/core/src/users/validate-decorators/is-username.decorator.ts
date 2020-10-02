import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function isUsername(options?: { nullable?: boolean }): PropertyDecorator {
  const { nullable = false } = options || {};
  return applyDecorators(nullable ? IsOptional() : IsNotEmpty(), IsString(), MaxLength(20));
}
