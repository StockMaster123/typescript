import { Response } from "express"
import workerModel from "../models/worker"
import { errorHandle } from "../utils/error"


const getWorker = async (id:string, res:Response) =>{
    const worker:any = await workerModel.find({uid:id})
    if ( worker != undefined ){
        const { username, img, rating } = worker
        res.status(200).json({username, img, rating }) 
    }
    else errorHandle('Error al encontrar datos', res)
}
const workerStatus = async (id:string, status:boolean, res:Response) => {

    const worker:any = await workerModel.findOneAndUpdate({uid:id, active:status })
    if ( worker != undefined ) res.status(200).json({status})
    else errorHandle('Error al actualizar usuario', res)
}

export { getWorker, workerStatus }