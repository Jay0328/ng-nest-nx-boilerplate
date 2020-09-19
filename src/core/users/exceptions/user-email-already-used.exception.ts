export class UserEmailAlreadyUsedException extends Error {
  static readonly message = '[User] Email Already Used';

  constructor() {
    super(UserEmailAlreadyUsedException.message);
  }
}
