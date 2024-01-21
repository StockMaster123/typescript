import { Router, Request, Response } from 'express';
import { getUser, postUser, deleteUser, resetPassword, getUserGoogle, postUserGoogle, getWorker, updateIdSocket } from '../controllers/user';
import { verifyToken } from '../utils/verifyToken';
import { errorHandle } from '../utils/error';
import { validatePassword } from '../utils/validatePassword';
import { hashSync } from 'bcrypt';
import { googleSignUp } from '../utils/googleSign';
import { getHour } from '../utils/getTime';

const user = Router()



user.get('/user/:uid', async ( req:Request, res:Response ) => {
        const { uid } = req.params
        const { authorization } = req.headers
        try {
                if (authorization != undefined){
                        const token = await verifyToken(authorization)
                        if ( token.uid == uid || token.rol == 'worker' ) getUser( uid, res  )
                        else errorHandle('Something happened while validating token', res)
                }
                else errorHandle('No token found', res)
        
            } catch (error) {
                errorHandle('Error al ejcutar acción', res)
        }

})

user.get('/worker/:id', async ( req:Request, res:Response) => {
        const { id } = req.params
        const { authorization } = req.headers
        try {
                if (authorization != undefined){
                        const token = await verifyToken(authorization)
                        if ( token.rol == 'cliente' && token.status == 'active' ) getWorker( id, res  )
                        else errorHandle('Something happened while validating token', res)
                }
                else errorHandle('No token found', res)
        
            } catch (error) {
                errorHandle('Error al ejcutar acción', res)
        }

})

user.get('/user/google/:token', async ( req:Request, res:Response) => {
        const { token } = req.params
        if ( token != undefined){
                getUserGoogle(token, res)
        }
        else errorHandle('No token found', res)
                
})

user.post('/user/google', ({ body }:Request, res:Response)  => {
        const { token } = body
        googleSignUp(token, res)
})

user.post('/user', ({ body }:Request, res:Response)  => {
        postUser( body, res )
})

user.post('/user/:uid', async (req:Request, res:Response)  => {
        const { uid } = req.params
        const { authorization } = req.headers
        const { socketId } = req.body
        try {
                
                if ( authorization != undefined ){
                        const token = await verifyToken(authorization)
                        if ( token.uid === uid) updateIdSocket(uid,socketId,res)
                        else errorHandle('Algo ocurrió al validar token', res)
                }
                else errorHandle('No se encontro token', res)
        
            } catch (error) {
                errorHandle('Error al ejcutar acción', res)
        }
})

user.delete('/user/:uid', async ( req:Request, res:Response) => {
        const { uid } = req.params
        const { authorization } = req.headers

        try {
                
                if ( authorization != undefined ){
                        const token = await verifyToken(authorization)
                        if ( token.uid === uid) deleteUser(uid,res)
                        else errorHandle('Algo ocurrió al validar token', res)
                }
                else errorHandle('No se encontro token', res)
        
            } catch (error) {
                errorHandle('Error al ejcutar acción', res)
        }
})

user.put('/user/:authorization', async ( req:Request, res:Response) => {
        const { newPassword } = req.body
        const { authorization } = req.params
        try {
                if ( authorization != undefined ){
                        const token = await verifyToken(authorization)
                        if ( token != undefined ){
                                const result = await validatePassword( newPassword )
                                if ( result ){
                                        const encryptPassword = hashSync(newPassword,10)
                                        resetPassword(token.email, encryptPassword, res )
                                }
                                else errorHandle('Algo ocurrió al validar password', res)
                        }
                        else errorHandle(`Algo ocurrió al validar token`, res)
                }
               else errorHandle('No se encontro token', res)
        
            } catch (error) {
                errorHandle('Error al ejcutar acción', res)
        }
})

export {  user }