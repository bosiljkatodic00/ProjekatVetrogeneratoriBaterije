import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    userType: String
})

const UserModel = mongoose.model("allUsers", UserSchema)
export default UserModel;
