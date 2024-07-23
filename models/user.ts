import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    
    uid: String,
    username: String,
    img: String,
    email : String,
    password : String,
    rol : String,
    status: String,
    type: String,
    stripeId: String,
    socketId: String

}, { versionKey: false })

const userModel = model('User', UserSchema)

export default userModel