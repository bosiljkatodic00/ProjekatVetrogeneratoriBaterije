export default class UserModel {
    constructor(data) {
        this.firstName = data.firstName;
        this.email = data.email;
        this.lastName = data.lastName;
        this.password = data.password;
        this.userType = data.userType;
    }
}