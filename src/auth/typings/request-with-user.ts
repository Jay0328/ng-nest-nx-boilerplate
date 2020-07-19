import { Request } from 'express';
import { AuthPayload } from './auth.typings';

export interface RequestWityUser extends Request {
  user: AuthPayload;
}
