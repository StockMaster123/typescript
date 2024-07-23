import mongoose, { model, Schema } from "mongoose";

const WorkerSchema = new Schema({
    uid: String,
    username: String,
    img: String,
    rating: mongoose.Types.Decimal128

}, { versionKey: false })

const LocationSchema = new Schema({

    latitude: Number,
    longitude: Number

}, { versionKey: false })


const dateSchema = new Schema({

    date: String,
    hour: String

}, { versionKey: false })

const AddsSchema = new Schema({

    name: String,
    price: Number,
    isAdd: Boolean,
    description: String

}, { versionKey: false })

const PackageSchema = new Schema({

    packageName: String,
    total: Number,
    car: String,
    category: String,
    addsOn: [AddsSchema]

}, { versionKey: false })

const OrderSchema = new Schema({
    uid: String,
    type: String,
    address:LocationSchema,
    time:dateSchema,
    packages:[PackageSchema],
    total: Number,
    status: String,
    worker: String,
    date: String,
    statusPay: String,
    idPayment: String

    
}, { versionKey: false })

const orderModel = model('order', OrderSchema)

export default orderModel
