export class InvalidRefreshTokenException extends Error {
  static readonly message = '[Auth] Invalid Refresh Token';

  constructor() {
    super(InvalidRefreshTokenException.message);
  }
}
