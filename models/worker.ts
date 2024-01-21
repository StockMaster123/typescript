import { model, Schema } from "mongoose";

const orderScheme = new Schema({
    data:[{ id:String,  month: Number }]
})

const WorkerSchema = new Schema({
    
    uid: String,
    username: String,
    rating: String,
    img: String,
    active: Boolean,
    orders: [ orderScheme ]
    
}, { versionKey: false })

const workerModel = model('Worker', WorkerSchema)

export default workerModel