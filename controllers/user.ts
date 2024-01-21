import { Response } from "express";
import { Users } from '../interfaces/user.interface';
import userModel from "../models/user";
import { hashSync } from "bcrypt"
import { validatePassword } from "../utils/validatePassword";
import { errorHandle } from "../utils/error";
import { getToken } from "../utils/getToken";
import { findWorker } from "../utils/findWorker";
import { findUserEmail } from "../utils/findUserEmail";
import { findUserId } from "../utils/findUserId";

const getUser = async ( uid:string, res:Response) => {
    try {
        if ( uid ){

            const user = await findUserId(uid)
            const token = await getToken(user)
            if ( user?.status == 'active') res.status(200).json(token)
            else errorHandle("Este usuario a sido eliminado", res)
        }
        else errorHandle("El campo es requerido", res)
    } catch (error) {
        errorHandle("Algo ocurrio al obtener usuario", res)
    }
}

interface Worker{
    username:string,
    rating: number,
    img: string
}

const getWorker = async ( uid:string, res:Response) => {
    try {
        if ( uid ){

            const worker= await findWorker(uid)
            if ( worker ) {
                const { username, rating, img } = worker
                res.status(200).json({ username, rating, img })

            }
            else errorHandle("Error al obtener datos", res)
        }
        else errorHandle("El campo es requerido", res)
    } catch (error) {
        errorHandle("Algo ocurrio al obtener usuario", res)
    }
}

const getSocketId = async ( uid:string | undefined) => {
    try {
        if ( uid ){

            const user = await findUserId(uid)
            if ( user ) {
                return user.socketId
            }
            else return null
        }
        
    } catch (error) {
        
        return EvalError
    }
}

const postUser = async ( { username, email, password }: Users, res: Response) => {

    try {
        if ( !( username && email && password ) ){
            
            errorHandle("Todos los campos son requerídos", res)
        }
        var user  = await findUserEmail(email)
        if ( user == null ) {
            var resultValidate = await validatePassword(password)
    
                if( resultValidate ){
                    var encryptPassword = hashSync(password,10)
                    var uid = crypto.randomUUID()
                    var newUser:any = await userModel.create({ uid, username, img:'', email, password:encryptPassword, rol:'cliente', status:'active', type:'email-password', socketId:'' })
                    var token = await getToken(newUser)
                    res.status(200).json(token)
                }
                else { errorHandle("La contraseña no cumple con los requisitos", res) }
        }
        else errorHandle("Algo a ocurrido al intentar crear tu usuario", res)
        
    } catch (error) {
        errorHandle("Vaya, algo a ocurrido", res)
    }

   

}

const updateIdSocket = async (uid:string, socketId:string, res: Response) => {
    try {
        if ( !( uid && socketId ) ){
            
            errorHandle("Todos los campos son requerídos", res)
        }
        else {
        await userModel.findOneAndUpdate({uid}, {socketId})
        res.status(200).json('Usuario actualizado'+socketId) 
    }
       
    } catch (error) {
        errorHandle("Vaya, algo a ocurrido", res)
    }

   

}

const postUserGoogle = async ({ username, email, img }:any, res:Response) =>{

    try {
        if ( !( username && email  ) ){
            
            errorHandle("Todos los campos son requerídos", res)
        }
        var user  = await findUserEmail(email)
        if ( user == null) {
                    var uid = crypto.randomUUID()
                    var newUser:any = await userModel.create({ uid, username, img, email, rol:'cliente', status:'active', type:'google-user' })
                    var token = await getToken(newUser)
                    res.status(200).json(token)
        }
        else errorHandle("Vaya, hemos encontrado un usuario con este corrreo", res)
                
    } catch (error) {
        errorHandle("Vaya, algo a ocurrido", res)
    }

}

const getUserGoogle = async ( email:string, res:Response) => {
    try {
        if ( email ){
            
            var googleUser = await findUserEmail(email)
            if ( googleUser?.type == 'google-user' && googleUser.status == 'active')
             {
                const token = await getToken(googleUser)
                res.status(200).json(token)
             }
             else errorHandle("Error al obtener este usuario", res)
        }
        else errorHandle("El campo es requerido", res)
    } catch (error) {
        errorHandle("Algo ocurrio", res)
    }
    
}

const deleteUser = async ( uid:string, res: Response) => {

    try {
        var deleteUser = await userModel.findOneAndUpdate({uid}, { status:'inactive' })
        res.status(200).json("Usuario eliminado")
    } catch (error) {
        errorHandle("Error, algo a ocurrido al eliminar usuario", res)
    }  
}

const resetPassword = async ( uid:string, password:string, res: Response) =>{
    try {
        var updatePass = await userModel.findOneAndUpdate({uid}, {password })
        res.status(200).json("Has editado tu password")
    } catch (error) {
        errorHandle("Error, algo a ocurrido", res)
    }   
}

export  { getUser, getSocketId, getWorker, getUserGoogle, postUser, updateIdSocket, postUserGoogle, deleteUser, resetPassword }