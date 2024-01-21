import userModel from "../models/user"

const findUserEmail = async ( email:string ) => {
    var user = await userModel.findOne({ email })
    return user  
}
export { findUserEmail }