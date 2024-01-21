import { Users } from "../interfaces/user.interface"
import userModel from "../models/user"

const findUserId = async ( uid:string ) => {
    var user = await userModel.findOne({ uid })
    return user  
}
export { findUserId }