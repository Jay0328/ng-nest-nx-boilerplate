export interface AuthPayload {
  email: string;
  firstName: string;
  lastName: string;
}

export interface JwtPayload extends AuthPayload {
  exp: number;
  iat: number;
}
