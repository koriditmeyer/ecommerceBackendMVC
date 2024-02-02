export class CreateUserDTO {
  constructor(user) {
    Object.assign(this, user);
  }
}

export class UserResponseDTO {
  constructor(user) {
    (this._id = user._id),
    (this.name = user.name),
    (this.role = user.role)
  }

  //   toPOJO() {
  //     return {
  //       name: this.name,
  //       role: this.role,
  //     };
  //   }
}
