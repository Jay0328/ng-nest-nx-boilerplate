import { EntityID } from '../../orm';

export interface AuthPayload {
  readonly id: EntityID;
  readonly email: string;
  readonly username: string;
}

export interface JwtPayload extends AuthPayload {
  readonly exp: number;
  readonly iat: number;
}
