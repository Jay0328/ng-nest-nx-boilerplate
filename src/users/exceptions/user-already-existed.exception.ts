export class UserAlreadyExistedException extends Error {
  static readonly code = '[User] Already Existed';

  constructor() {
    super(UserAlreadyExistedException.code);
  }
}
