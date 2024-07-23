const stripe = require('stripe')('sk_test_51PRlUVP1qlt3s4ruOOt3Tftyrgy9c5Gbp9Zz7ZASFyb1xN1ZlcQpGIFGujEpko9UD9mISNjbi5PGDyECfCFGJHOI00n4uiJ68R');
import { Request, Response } from "express";
import { errorHandle } from "../utils/error";





const paymentConfirm = async (params:{ stripeId:any, idPayment:any, total:any }) => {
  const { stripeId, idPayment, total } = params
  const setupIntent = await stripe.setupIntents.retrieve(idPayment);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      customer:stripeId,
      amount: total*100,
      currency: 'usd',
      payment_method: setupIntent.payment_method,
      confirm: true,
      off_session: true,
    });

  } catch (error) {
    console.error('Error al crear el PaymentIntent:', error);
  }
   
};

const paymentSheet = async (req:Request, res:Response) =>{
 
  const { customer } = req.body
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer },
    {apiVersion: '2020-08-27'}
  );
  
  const paymentIntent = await stripe.paymentIntents.create({
    customer,
    amount: 2000, // el monto en centavos
    currency: 'usd',
    capture_method: 'manual', // captura manual
    payment_method_types: ['card'] // tipos de métodos de pago
  })

    res.json({
    paymentIntent: paymentIntent.client_secret,
    paymentId: paymentIntent.id,
    ephemeralKey: ephemeralKey.secret
  });
}

const createSetupIntent = async (req:Request, res:Response) => {
  const { customer } = req.body

  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer},
    {apiVersion: '2020-08-27'}
  );
  
  const setupIntent = await stripe.setupIntents.create({
    customer,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    
    
  });

  //const confirmSetupIntent = await stripe.setupIntents.confirm(setupIntent.id);
  //const setupIntentData = await stripe.setupIntents.retrieve(setupIntent.id);
  res.json({
    setupIntent: setupIntent.client_secret,
    idPayment: setupIntent.id,
    ephemeralKey: ephemeralKey.secret
  })
};

const paymentUpdate = async (req:Request, res:Response) => {
  const { idPayment } = req.params
  const { newTotal } = req.body
  await stripe.paymentIntents.update(idPayment,{
  amount:newTotal*1.00
 })
 .then((paymentIntent:any) => {
   res.status(200).send(paymentIntent);
   // Aquí puedes manejar la lógica adicional después de confirmar el PaymentIntent
 })
 .catch((error:any) => {
    console.log(error)
    errorHandle('Error al confirmar el PaymentIntent:', res);
   // Aquí puedes manejar el error
 });
   
};

export { paymentConfirm, createSetupIntent, paymentSheet, paymentUpdate }