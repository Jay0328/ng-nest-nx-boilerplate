export interface AuthPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface JwtPayload extends AuthPayload {
  exp: number;
  iat: number;
}
