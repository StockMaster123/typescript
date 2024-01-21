import { Router, Request, Response } from 'express';
import { sendEmail } from '../utils/sendEmail';
import { errorHandle } from '../utils/error';
import { verifyToken } from '../utils/verifyToken';
import userModel from '../models/user';

const resetPassword = Router()

resetPassword.get('/resetpassword/:token', async (req:Request, res:Response)=>{
    const { token } = req.params
    try {
        if ( token != undefined ){
               verifyToken(token)
               .then((token) => {
                    res.sendFile('/home/sdplhjtv/cyber/src/reset-password.html', {
                        headers:token
                    });
               })
               .catch(() => errorHandle('Algo a ocurrido al validar token', res))
            
        }
       else errorHandle('No se encontro token', res)

    } catch (error) {
        errorHandle('Error al ejcutar acción', res)
}

})

resetPassword.post('/resetpassword', async ( req:Request, res:Response ) => {
    
    const { email } = req.body
    if ( email != undefined ) {
        const user = await  userModel.findOne({ email })
        if ( user?.status == "active" && user.type == "email-password")
       {
        sendEmail(email)
        .then(() => res.status(200).json('The email has been sent') )
        .catch(() => errorHandle(`Error sending email`, res))
       }
       else errorHandle(`Unable to reset password`, res)
    }
    
    else errorHandle("Email is mandatory", res)

    
})
export { resetPassword }