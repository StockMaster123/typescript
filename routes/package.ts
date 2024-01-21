import { Request, Response, Router } from "express";
import { errorHandle } from "../utils/error";
import { verifyToken } from "../utils/verifyToken";
import { getPackage, getPackages } from "../controllers/package";

const packages = Router()

packages.get('/packages/:type',  ( req:Request, res:Response) => {

    const { type } = req.params
    const { authorization } = req.headers
    if ( authorization != undefined ){
        verifyToken(authorization)
        .then((e) =>{
            if ( e != undefined ) {
            getPackages(type)
                .then((packages) => res.json(packages))
                .catch((e)=> errorHandle('Error al verificar token'+ e, res))
            }
            else errorHandle('Error al verificar token', res)
        })
        .catch((err)=>{
            errorHandle('Error al ejecutar la acción', res)
        })
    }
    else errorHandle('Error al encontrar token', res)
   
})

packages.get('/packages/:type/:id', ( req:Request, res:Response) => {
    const { type, id } = req.params
    const { authorization } = req.headers
    if ( authorization != undefined ){
        verifyToken(authorization)
        .then((token) =>{
                if ( token != undefined ) {
                getPackage(type, id)
                .then((packages) => res.json(packages))
                }
                else errorHandle('Error al verificar token', res)
            })
        .catch(() => errorHandle('Error al ejecutar la acción', res))
    }
    else errorHandle('Error al encontrar token', res)
    
})

export { packages }