import { Order, Packages } from "../interfaces/order.interface"
import orderModel from "../models/order"
import workerModel from "../models/worker"
import { getDate } from "../utils/getDate"



interface GetWorkerProps{
    authorization: string,
    worker: string
}


const getOrderId = async (id:string) =>{
    try {
        var order = await orderModel.findById(id)
        return order

    } catch (error) {
        return null
    }
        
}

const getOrdersWorker = async (id:string) =>{
    try {
        var orders:any = await orderModel.find({worker:id, status:'accepted'})
        var filter = []
        for (const { id, packages, status } of orders) {
            const cant = packages.length
            filter.push({ id, cant, status })
        }
        return filter.reverse()
    } catch (error) {
        return null
    }
        
}

const getPendingOrders = async () =>{
    try {
        var orders:any = await orderModel.find({status:'pending'})
        var filter = []
        for (const { id, packages, status } of orders) {
            const cant = packages.length
            filter.push({ id, cant, status })
        }
        return filter.reverse()
    } catch (error) {
        return null
    }
        
}


const getOrderHistory = async (worker:string) =>{
    try {
        var filter = []
        var orders = await orderModel.find({worker,status:'finished'})
        for (const { id, packages, status } of orders) {
            const cant = packages.length
            filter.push({ id, cant, status })
        }
        return filter.reverse()
    } catch (error) {
        return null
    }
}

const getDataOrder = async (worker:string) =>{
    try {
        var orderTotal = []
        var orderDay = []
        const fechaActual = new Date().getDate()
       

        var diasSemana = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Tengo que devolver los días junto con el total
        
       

        for (let index = 0; index < 7; index++) {
            var fecha = new Date()

            var day = fecha.getDate(); // Obtiene el día del mes (1-31)
            var month = fecha.getMonth() + 1; // Obtiene el mes (0-11) y sumamos 1 para obtener el mes real (1-12)
            var year = fecha.getFullYear(); 

            var totalOrder = 0
            fecha.setDate(fechaActual - index);
            var diaSemana = diasSemana[fecha.getDay()];
            var day = fecha.getDate(); // Obtiene el día del mes (1-31)
            var dateFormat = ''
            if (month < 10 && day > 9)
            dateFormat = `${year}-0${month}-${day}`;
                if (month < 10 && day >= 10)
                    dateFormat = `${year}-0${month}-${day}`;
                if (month >= 10 && day < 10)
                    dateFormat = `${year}-${month}-0${day}`;
                if (month >= 10 && day >= 10)
                    dateFormat = `${year}-${month}-${day}`;
                if ( month < 10 && day < 10)
                dateFormat = `${year}-0${month}-0${day}`;

            var orders:any = await orderModel
            .find({worker, status:'finished', date: dateFormat })
            orders.map((item:any) =>{
                totalOrder = totalOrder + item.total
            })
            orderTotal.push(totalOrder)
            orderDay.push(diaSemana)
        }
        return { orderTotal, orderDay }
    } catch (error) {
        return null
    }
}

const getOrderTotal = async (uid:string) =>{
    try {

        var data = await workerModel.findOne({uid})
        const num = data?.orders
        return num

    } catch (error) {
        return null
    }
        
}

const getOrders = async () =>{
    try {
        var filter = []
        var orders = await orderModel.find({status:'pending'})
        for (const { id, packages, status } of orders) {
            const cant = packages.length
            filter.push({ id, cant, status })
        }
        return filter.reverse()
    } catch (error) {
        return null
    }
        
}

const getOrderUser = async( uid:string | undefined ) => {
    try {
        var filter = []
        var orders = await orderModel.find({uid})
        for (const { id, packages, status } of orders) {
                const cant = packages.length
                filter.push({ id, cant, status })
            
        }
        return filter.reverse()

    } catch (error) {
        return null
    }

}

const acceptedOrderWorker = async (id:string, worker:string) =>{

    const dateFormat = getDate()

    try {
        var orders:any = await orderModel.findByIdAndUpdate({_id:id}, { status:'accepted' , worker, date:dateFormat })
        return orders
    } catch (error) {
        return null
    }
}

const finishOrderWorker = async (id:string, worker:string) =>{

    try {
        var orders:any = await orderModel.findByIdAndUpdate({_id:id, worker}, { status:'finished'})
        return orders
    } catch (error) {
        return null
    }
}


const postOrders = async ( order:Order, uid:string ) => {
    const { address, time, packages, type} = order
    var total:number = 0
    packages.map((item:any) =>{
        total = total + item.total
    })
    var newOrder = await orderModel.create({ uid, packages, address, time, type, total, status:'pending', worker:''})
    return newOrder
   
    
}

const updateOrder = async ( payload: { uid:string, newOrder:any, id:string } ) => {
    
    const { uid, newOrder, id } = payload
    const result:any = await orderModel.findOne({_id:id})
       if ( result?.uid == uid ){
            var { packages, total } = result
            packages.push(newOrder)

            var total2:number = total + newOrder.total
            var updateOrdernow = await orderModel.updateOne({_id:id}, { packages, total:total2 })
            return updateOrdernow 
       }
    return null
        
}

const updatePackage = async ( payload: { uid:string, newPackage:Packages, id:string } ) =>{
    const { uid, newPackage, id } = payload
    const result = await orderModel.findOne({_id:id})
    var total2:number = 0
    if ( result != null && result.status != 'canceled' && result.uid == uid ){
        var { packages  } = result
        packages.map((item:any) => {
            if (item._id == newPackage.id){ item.addsOn = newPackage.addsOn, item.total = newPackage.total }
        });
        for (const item of packages) {
            if (item.total != undefined)
            {  total2 = item.total + total2 }
        }
        var updateOrdernow = await orderModel.updateOne({ _id:id },{ packages , total:total2  })
         return updateOrdernow 
    }
    return null
}

const deletePackage = async ( payload:{ id:string, packageId:string } ) =>{
    const { id, packageId } = payload
    const result:any = await orderModel.findOne({_id:id})
        var { packages } = result
        if ( packages.length > 1 ){
            var total2:number = 0
            const packagesArray:any = packages.filter((item:any) => item._id != packageId );
            packagesArray.map((item:any) =>{
        
                    total2 = total2 + item.total
            })
            var updateOrdernow = await orderModel.updateOne({ _id:id },{ packages:packagesArray , total:total2  })
            return updateOrdernow 
        }
        else  {
            cancelOrder(id)
        }
   
}

const cancelOrder = async ( id:string  ) => {
    var canceledOrder = await orderModel.updateOne({ _id:id }, { status:'canceled' })
    return canceledOrder
    
}




export  { getPendingOrders, acceptedOrderWorker, getOrderId, getOrderUser, postOrders, updateOrder, updatePackage, deletePackage, cancelOrder, getOrdersWorker, getOrders, getOrderTotal, getOrderHistory, getDataOrder, finishOrderWorker }