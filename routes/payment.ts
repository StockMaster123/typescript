import { Router, Request, Response } from 'express';
import { errorHandle } from '../utils/error';
import { paymentAction } from '../controllers/payment';

const payment = Router()


payment.get('/payment', async (req:Request, res:Response) => {
    try {
        const authorization = req.headers.authorization
        if (authorization != undefined)
        {
            paymentAction(req, res)
        }
    } catch (error) {
        errorHandle('Algo a ocurrido al encontrar token',res)
    }

})



export { payment }