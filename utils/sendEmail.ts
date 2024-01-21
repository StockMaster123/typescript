import nodemailer  from 'nodemailer';
import jwt from 'jsonwebtoken';

 const sendEmail = async (email:string) =>{
    var config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth:{
            user: 'davidrma07@gmail.com',
            pass: 'qfhsgyowgjnqbhgb'
        }
    }
    var transport = nodemailer.createTransport(config)
    var secretKey = "ary16"
    var token = jwt.sign({ email }, secretKey, {
            expiresIn: "30m"
    })
    const message = {
        from:'davidrma07@gmail.com',
        to: `${email}`,
        subject:'Reestablecer contraseña',
        text: `http://localhost:200/resetpassword/${token}`
    }

    const info = await transport.sendMail(message)
    return info
 }

 export { sendEmail }