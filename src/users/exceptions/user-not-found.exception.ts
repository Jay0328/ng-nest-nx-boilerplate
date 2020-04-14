export class UserNotFoundException extends Error {
  constructor() {
    super('User Not Found');
  }
}
