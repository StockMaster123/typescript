import workerModel from "../models/worker"
interface Worker{
    username:string,
    rating: number,
    img: string
}
const findWorker = async ( uid:string ) => {
    var user = await workerModel.findOne({ uid })
    if ( user ) return user 
    else null
}
export { findWorker }