export class UserExistedException extends Error {
  constructor() {
    super('User Existed');
  }
}
