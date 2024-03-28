const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    userType: String
})

const UserModel = mongoose.model("allUsers", UserSchema)
module.exports = UserModel