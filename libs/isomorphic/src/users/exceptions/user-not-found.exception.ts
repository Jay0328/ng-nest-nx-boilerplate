export class UserNotFoundException extends Error {
  static readonly message = '[User] Not Found';

  constructor() {
    super(UserNotFoundException.message);
  }
}
