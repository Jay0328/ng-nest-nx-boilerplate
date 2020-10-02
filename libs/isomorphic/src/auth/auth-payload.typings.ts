export interface AuthPayload {
  readonly id: string;
  readonly email: string;
  readonly username: string;
}

export interface JwtPayload extends AuthPayload {
  readonly exp: number;
  readonly iat: number;
}
