import { Socket,  } from "socket.io"
import { acceptedOrderWorker, cancelOrder, deletePackage, finishOrderWorker, getDataOrder, getOrderHistory, getOrderId, getOrderUser, getPendingOrders, getOrdersWorker, postOrders, updateOrder, updatePackage } from "../controllers/order"
import { Order, Packages } from "../interfaces/order.interface"
import { getHour } from "../utils/getTime"
import { getSocketId } from "../controllers/user"

const controllerSockets =  (io:any, socket:Socket) => {

    socket.on('getHour', async (date:string) =>{
        const arrayHour = getHour(date)
        if ( arrayHour ) io.to(socket.id).emit('onHour', arrayHour)

    })
    socket.on(('postOrder'), async (payload:{ order:Order, uid:string }, callback) =>{
            const result = await postOrders(payload.order, payload.uid)
            const orders = await getOrderUser(payload.uid)
            if ( result != undefined ){
                io.to(socket.id).emit('onOrders', orders)
                const pending = await getPendingOrders()
                io.emit('onPendingOrders', pending)
                callback({message:'Su orden fue generada con éxito'})

            }
             
                callback({message:'Error, al crear orden'})
    })

    socket.on(('getOrdersWorker'), async (payload, callback) =>{
        const { uid } = payload
        const orders = await getOrdersWorker(uid)
            if ( orders != undefined )
            {
                io.to(socket.id).emit('getOrdersWorker', orders)
            }
            else 
                callback({message:'Error, al cancelar orden'})
    })

    socket.on(('acceptedOrder'), async (payload, callback) =>{
        const { id, worker } = payload
        const accepted = await acceptedOrderWorker(id, worker)
            if ( accepted != undefined )
            {
                const orders = await getOrdersWorker(worker)
                const order = await getOrderId(id)
                const socketIdUser = await getSocketId(order?.uid)
                const orderUser = await getOrderUser(order?.uid)

                const pending = await getPendingOrders()
                socket.emit('onPendingOrders', pending)
                io.to(socket.id).emit('getOrdersWorker', orders)
                io.to(socket.id).emit('onOrderId', order)
                io.to(socketIdUser).emit('onOrders', orderUser)
                io.to(socketIdUser).emit('onOrderId', order)
            }
            else 
                callback({message:'Error, al cancelar orden'})
    })

    socket.on(('finishOrder'), async (payload, callback) =>{
        const { id, worker } = payload
        const history = await finishOrderWorker(id, worker)
            if ( history != undefined )
            {
                const pending = await getPendingOrders()
                const orders = await getOrdersWorker(worker)
                const order = await getOrderId(id)
                const socketIdUser = await getSocketId(order?.uid)
                const dataOrder = await getDataOrder(worker)
                const orderUser = await getOrderUser(order?.uid)

                io.to(socket.id).emit('onOrderId', order)
                io.to(socket.id).emit('getHistory', history)
                io.to(socket.id).emit('getOrdersWorker', orders)
                io.to(socket.id).emit('onDataWorker', dataOrder)
                socket.emit('onPendingOrders', pending)
                io.to(socketIdUser).emit('onOrders', orderUser)
                io.to(socketIdUser).emit('onOrderId', order)

                

            }
            else 
                callback({message:'Error, al cancelar orden'})
    })

    socket.on(('getHistory'), async (payload, callback) =>{
        const { uid } = payload
        const orders = await getOrderHistory(uid)
            if ( orders != undefined )
            {
                io.to(socket.id).emit('onHistory', orders)

            }
            else 
                callback({message:'Error, al obtener ordenes'})
    })

    socket.on(('getDataWorker'), async (payload, callback) =>{
        const { uid } = payload
        const orders = await getDataOrder(uid)
            if ( orders != undefined )
            {
                io.to(socket.id).emit('onDataWorker', orders)

            }
            else 
                callback({message:'Error, al obtener ordenes'})
    })

    socket.on(('getPendingOrders'), async (callback) =>{
        const pending = await getPendingOrders()
            if ( pending != undefined )
            {
                socket.emit('onPendingOrders', pending)

            }
            else 
                callback({message:'Error, al obtener ordenes'})
    })

    socket.on(('getOrders'), async (payload:{ uid:string}, callback) =>{
        const { uid } = payload
        const order = await getOrderUser(uid)
            if ( order != undefined )
            {
                io.to(socket.id).emit('onOrders', order)
            }
            else 
                callback({message:'Error, al cancelar orden'})
    })

    socket.on(('getOrderId'), async (payload:{ id:string}, callback) =>{
        const { id } = payload
        const order = await getOrderId(id)
            if ( order != undefined )
            {
                io.to(socket.id).emit('onOrderId', order)
            }
            else 
                callback({message:'Error, al cancelar orden'})
    })

    socket.on(('cancelOrder'), async (payload:{ uid:string, id:string } , callback) =>{
        const res = await cancelOrder(payload.id)
        if ( res != undefined ){
            const orders = await getOrderUser(payload.uid)
            io.to(socket.id).emit('onOrders', orders)
            const pending = await getPendingOrders()
            io.emit('onPendingOrders', pending)
            callback({message:'Su orden fue cancelada con éxito'})
        }
        else 
            callback({message:'Error, al cancelar orden'})
    })

    socket.on(('updateOrder'), async (payload: { socketId:string, uid:string, newOrder: {}, id:string }, callback )=>{

        const res = await updateOrder( payload )
        const pending = await getPendingOrders()
        const orders = await getOrderUser(payload.uid)
        if ( res != undefined ){
            io.to(socket.id).emit('onOrders', orders)
            io.emit('onPendingOrders', pending)
            callback({message:'Su orden fue actualizada con éxito'})
        }
        else 
            callback({message:'Error, al actualizar orden'})
            
    })

    socket.on(('updatePackage'), async (payload: { uid:string, newPackage:Packages, id:string }, callback )=>{
        const packages = await updatePackage(payload)
        const { id, uid } = payload

        if ( packages != undefined ){
             const order = await getOrderId(id)
             const orders = await getOrderUser(uid)
             const pending = await getPendingOrders()
            io.to(socket.id).emit('onOrderId', order)
            io.to(socket.id).emit('onOrders', orders)
            io.emit('onPendingOrders', pending)
            callback({message:'Su paquete fue actualizado con éxito'})
        }
        else 
            callback({message:'Error, al actualizar paquete'})
            
    })
    
    socket.on(('deletePackage'), async (payload: { uid:string, id:string, packageId:string }, callback )=>{
        const { uid, id } = payload
        const packages = await deletePackage(payload)
        const orders = await getOrderUser(uid)
        const pending = await getPendingOrders()

        if ( packages ){
            const order = await getOrderId(id)
            io.to(socket.id).emit('onOrderId', order)
            
            callback({message:'Su paquete fue cancelado con éxito',order})
        }
        else {
            callback({message:'Success, orden eliminada', order:[] })
        }
        io.to(socket.id).emit('onOrders', orders)
        io.emit('onPendingOrders', pending)  
    })
   
    
}
    




export { controllerSockets }