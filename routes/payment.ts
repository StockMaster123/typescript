import { Router, Request, Response } from 'express';
import { errorHandle } from '../utils/error';
import {  paymentConfirm,  paymentUpdate, createSetupIntent } from '../controllers/payment';

const payment = Router()



payment.post('/payment', async (req:Request, res:Response) => {
    try {
        //const authorization = req.headers.authorization
      createSetupIntent(req,res)
        
    } catch (error) {
        errorHandle('Algo a ocurrido al encontrar token',res)
    }

})
/*payment.post('/payment/:stripeId/:idPayment', async (req:Request, res:Response) => {

    try {
        //const authorization = req.headers.authorization
      
            paymentConfirm(req, res)
        
    } catch (error) {
        errorHandle('Algo a ocurrido al encontrar token',res)
    }

})*/

payment.put('/payment/:idPayment', async (req:Request, res:Response) => {
    try {
        //const authorization = req.headers.authorization
      paymentUpdate(req,res)
        
    } catch (error) {
        errorHandle('Algo a ocurrido al encontrar token',res)
    }

})



export { payment }