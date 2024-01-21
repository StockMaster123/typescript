import { Request, Response } from "express";
import { errorHandle } from "../utils/error";

import {   Client, Environment  } from 'square'

const client = new Client({
    accessToken: 'EAAAEHCorbpNDvG9apVXgm2HiPExwwfCsGvxBnQj1Zjjc--U8dMA5gKIkrHXAzPC',
    environment: Environment.Sandbox
});

const paymentsApi = client.paymentsApi;

const paymentAction = async (req:Request, res:Response) => {
    
    try{
        var pay =  await paymentsApi.createPayment({
                  sourceId: req.body.sourceId,
                  idempotencyKey: req.body.idempotencyKey,
                  amountMoney: req.body.amountMoney,
                  tipMoney: req.body.tipMoney,

          });
          console.log(pay)
          res.status(200).json(pay);
      
      } catch (error) {
          errorHandle('Algo a ocurrido al crear el pago',res)
      }
   
};

export { paymentAction }