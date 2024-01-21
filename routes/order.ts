import { Request, Response, Router } from "express";
import { getOrderUser, getOrders, postOrders, cancelOrder, updateOrder, deletePackage, updatePackage, getOrdersWorker, acceptedOrderWorker, getOrderTotal, getOrderHistory, getDataOrder } from "../controllers/order";
import { errorHandle } from "../utils/error";
import { verifyToken } from "../utils/verifyToken";
import { findUserId } from "../utils/findUserId";

const order = Router()

/*order.get('/:uid/order', async (req: Request, res: Response) => {
    const { authorization } = req.headers
    const { uid } = req.params
    if ( authorization != undefined ){
        const token = await verifyToken(authorization)
            if ( token.uid == uid && token.rol == 'cliente' && token.status == 'active' ) {
                const orders = await getOrderUser( uid )
                res.status(200).json(orders)
            }
            else {
                if ( token.uid == uid && token.rol == 'worker' && token.status == 'active' ) {
                    const orders = await getOrders()
                    res.status(200).json(orders)
                }
                else 
                errorHandle('Something happened while getting token', res)
            }
    }
    else errorHandle('Something happened while getting token', res)
})

order.get('/:uid/history', async (req: Request, res: Response) => {
    const { authorization } = req.headers
    const { uid } = req.params
    if ( authorization != undefined ){
        const token = await verifyToken(authorization)
            if ( token.uid == uid && token.rol == 'worker' && token.status == 'active' ) {
                const orders = await getDataOrderWeek( uid )
                res.status(200).json(orders)
            }
            else errorHandle('Error al validar usuario', res)
            
    }
    else errorHandle('Something happened while getting token', res)
})

order.get('/:uid/order/accepted', async (req: Request, res: Response) => {
    const { authorization } = req.headers
    const { uid } = req.params
    if ( authorization != undefined ){
        const token = await verifyToken(authorization)
            if ( token.uid == uid && token.rol == 'worker' && token.status == 'active' ) {
                const orders = await getOrdersWorker( uid )
                res.status(200).json(orders)
            }
            else errorHandle('Error al validar usuario', res)
            
    }
    else errorHandle('Something happened while getting token', res)
})

order.get('/:uid/order/total', async (req: Request, res: Response) =>{
        const { uid } = req.params
        const { authorization } = req.headers

        if ( authorization != undefined ){
            const token = await verifyToken(authorization)
            if ( token.uid == uid && token.rol == 'worker' && token.status == 'active' ) {
                getOrderTotal( uid )
                .then((total:any)=>{
                    res.status(200).json(total)
                })
                .catch((err)=> errorHandle('Error al obtener total'+err, res))
            }
            else errorHandle('Error al validar usuario', res)
        }
        else errorHandle('Token no encontrado', res)
})

order.post('/:uid/order', (req: Request, res: Response) =>{
    const { authorization } = req.headers
    const { uid } = req.params
    if ( authorization != undefined )
    {
        verifyToken(authorization)
        .then((token) =>{
            if ( token.uid == uid && token.rol == 'cliente' && token.status == 'active' ) {
                postOrders( req.body, uid)
                    .then(() => res.status(200).json('La orden fue agregada correctamente'))
                    .catch((err) => errorHandle('Algo a ocurrido al agregar las ordenes' + err, res))
            }
            else errorHandle('Algo a ocurrido, Vuelve a intentarlo'  , res)
        })
        .catch((err) => errorHandle('Algo a ocurrido al ejecutar acción' + err, res))
    }
    else errorHandle('No se encontró el token', res)
})

order.put('/order/:id/:worker', async (req: Request, res: Response) =>{
    const { authorization } = req.headers
    const { id, worker } = req.params
    if ( authorization != undefined )
    {
        verifyToken(authorization)
        .then((token)  =>{
            if ( token.uid == worker && token.rol == 'worker' && token.status == 'active' ) {
                findUserId(token.uid)
                .then((user:any) =>{
                    if (user != undefined ){
                        updateOrderWorker(id, user.uid )
                        .then((e)=>{
                            res.status(200).json('Orden aceptada correctamente')  
                        })
                        .catch(()=> errorHandle('Error al intentar actualizar orden'  , res))
                    }
                })
            }
            else errorHandle('Algo a ocurrido, Vuelve a intentarlo'  , res)
        })
        .catch((err) => errorHandle('Algo a ocurrido al ejecutar acción' + err, res))
    }
    else errorHandle('No se encontró el token', res)
})

order.put('/:uid/order/:id', (req: Request, res: Response) => {

    const { uid, id } = req.params
    const { authorization } = req.headers
    if (authorization != undefined){
        verifyToken(authorization)
        .then((token) =>{ 
            if ( token.uid == uid ) {
                updateOrder( req.body, id )
                    .then((orders:any) => res.status(200).json(orders))
                    .catch((e) => errorHandle('Algo a ocurrido al obtener las ordenes' + e, res))
              
            }
            else errorHandle('Algo a ocurrido, Vuelve a intentarlo'  , res)
        })
        .catch((err) => errorHandle('Algo a ocurrido' + err, res))
    }
    else errorHandle('Algo a ocurrido al encontrar token', res)

})

order.put('/:uid/order/:id/:packageId', (req: Request, res: Response) => {

    const { uid, id } = req.params
    const { authorization } = req.headers
    if ( authorization != undefined) {
        verifyToken(authorization)
        .then((token) =>{ 
            if ( token.uid == uid ) {
                    updateOrderPackage(req.body, id  )
                    .then(() => res.status(200).json('La orden fue actualizada correctamente'))
                    .catch((err) => errorHandle('Algo a ocurrido al obtener las ordenes' + err, res))
            
            }
            else errorHandle('Algo a ocurrido, Vuelve a intentarlo'  , res)
    })
    .catch((err) => errorHandle('Algo a ocurrido, Vuelve a intentarlo' + err, res))
    }
    else errorHandle('Algo a ocurrido al encontrar token', res)

})

order.delete('/:uid/order/:id/:packageId', (req: Request, res: Response) =>{
    
    const { uid, id, packageId } = req.params
    const { authorization } = req.headers
    if ( authorization != undefined){
        verifyToken(authorization)
        .then((token) =>{ 
            if ( token.uid == uid ) {
                deletePackage(id, packageId )
                    .then((result) => {
                            if ( result != null){
                                res.status(200).json(`Su paquete a sido eliminado`)
                            }
                            else errorHandle('Algo a ocurrido al borrar paquete', res)
                    })
                    .catch((e) => errorHandle('Algo a ocurrido al obtener las ordenes', res))
               
            }
            else errorHandle('Algo a ocurrido, Vuelve a intentarlo'  , res)
        })
        .catch((err) => errorHandle('Algo a ocurrido al ejecutar acción' + err, res))
    }
    else errorHandle('Algo a ocurrido al encontrar token', res)
})

order.delete('/:uid/order/:id', (req: Request, res: Response) =>{
    
    const { uid, id } = req.params
    const { authorization } = req.headers
    if ( authorization != undefined){
        verifyToken(authorization)
        .then((token) =>{ 
            if ( token.uid == uid ) {
                cancelOrder(id )
                    .then(() => res.status(200).json(`Su orden con el id: ${id} a sido cancelada`))
                    .catch((e) => errorHandle('Algo a ocurrido al obtener las ordenes' + e, res))
               
            }
            else errorHandle('Algo a ocurrido, Vuelve a intentarlo'  , res)
        })
        .catch((err) => errorHandle('Algo a ocurrido al ejecutar acción' + err, res))
    }
    else errorHandle('Algo a ocurrido al encontrar token', res)
})*/

export { order }