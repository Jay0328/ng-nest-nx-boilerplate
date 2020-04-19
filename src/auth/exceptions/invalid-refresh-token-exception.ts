export class InvalidRefreshTokenException extends Error {
  constructor() {
    super('Invalid Refresh Token');
  }
}
