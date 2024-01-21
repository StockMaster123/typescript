import orderModel from "../models/order"

const verifyOrden = async (uid:string) => {
    var clientOrder = orderModel.findOne({uid})
    return clientOrder
}

export { verifyOrden }