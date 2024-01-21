import { Response } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = async ( authorization:string ) => {
        /* crear una autentificaión para obtener los datos más recientes en caso de reseteo de password */
        if ( authorization != undefined ){
                var secretKey = "ary16"
                var token:any = await jwt.verify(authorization, secretKey)
                return token
        }
        else return null

}

export { verifyToken }