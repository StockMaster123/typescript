import { Request, Response, Router } from "express"
import { workerStatus, getWorker } from "../controllers/worker"
import { verifyToken } from "../utils/verifyToken"
import { errorHandle } from "../utils/error"

const worker = Router()

worker.get('/worker/:id', async (req:Request, res:Response) => {
    const { id } = req.params
    const { authorization } = req.headers
        try {
                if (authorization != undefined){
                        const token = await verifyToken(authorization)
                        if ( token.uid == id && token.rol == 'worker' ) getWorker(id,res)
                        else errorHandle('Something happened while validating token', res)
                }
                else errorHandle('No token found', res)
        
            } catch (error) {
                errorHandle('Error al ejcutar acción', res)
        }
})

worker.post('/worker/:id/status', async (req:Request, res:Response) => {
        const { id } = req.params
        const { authorization } = req.headers
        const { status } = req.body
        try {
                if (authorization != undefined){
                        const token = await verifyToken(authorization)
                        if ( token.uid == id && token.rol == 'worker' ) workerStatus( id, status, res )
                        else errorHandle('Something happened while validating token', res)
                }
                else errorHandle('No token found', res)
        
            } catch (error) {
                errorHandle('Error al ejcutar acción', res)
        }
})

export { worker }