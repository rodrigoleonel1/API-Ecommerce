export default class UsersDTO {
    constructor(user) {
        this._id = user._id
        this.complete_name = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.age = user.age
        this.role = user.role
    }
}