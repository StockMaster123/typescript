import { compareSync } from "bcrypt"
import { errorHandle } from "../utils/error"
import { getToken } from "../utils/getToken"

import { Request, Response } from "express"
import { googleSignIn } from "../utils/googleSign"
import { findUserEmail } from "../utils/findUserEmail"




const authUser = async ({ body }:Request, res: Response) => {

    const { email } = body
    if ( email != '' ) {
      findUserEmail(email)
      .then((user:any) =>{
          if ( user != undefined || user != null ) {
              const comparePassword =  compareSync(body.password, user.password )
              if ( body.email == user.email && comparePassword ) {
                   const token = getToken(user)
                   if ( token.status == 'active' ) {
                    res.status(200).json(token)
                   }
                   else { errorHandle('User eliminado', res) }
              }
              else{ errorHandle('Incorrect user or password', res)}
              
          }
          else { errorHandle("Oops we haven't found any user that matches your credentials", res) }
        })
        .catch((err) => { errorHandle(`Something has gone wrong ${err}`, res)})
    }
    else errorHandle('All data is necessary', res)

}

const authGoogle = async (req:Request, res:Response) =>{

  var { token } = req.body
  token != ''? googleSignIn(token, res):errorHandle('Error finding token', res)

  
}

export { authUser, authGoogle }