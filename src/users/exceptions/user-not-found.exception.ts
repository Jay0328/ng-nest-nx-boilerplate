export class UserNotFoundException extends Error {
  static readonly code = '[User] Not Found';

  constructor() {
    super(UserNotFoundException.code);
  }
}
