export class CreateUserDTO {
  constructor(user) {
    Object.assign(this, user);
  }
}

export class UserResponseDTO {
  constructor(user) {
    (this._id = user._id),
    (this.first_name = user.first_name),
    (this.roles = user.roles),
    (this.verified = user.verified),
    (this.city_locality = user.city_locality),
    (this.postal_code = user.postal_code),
    (this.country_code = user.country_code)
  }

    toCookie() {
      return {
        roles: this.roles,
        _id: this._id,
        verified: this.verified
      };
    }
}
