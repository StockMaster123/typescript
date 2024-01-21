import {  model, Schema } from "mongoose";


const PackageSchema = new Schema({
    packageName : String,
    description: String,
    pricing : [{price: Number, car: String}],
    category : String,
    addsOn: [{String, Number, Boolean}],
    included: [{String}],
    imgs : String
    
}, { versionKey: false })

const packageModel = model('Package', PackageSchema)

export default packageModel