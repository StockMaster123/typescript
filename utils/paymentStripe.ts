const stripe = require('stripe')('sk_test_51PRlUVP1qlt3s4ruOOt3Tftyrgy9c5Gbp9Zz7ZASFyb1xN1ZlcQpGIFGujEpko9UD9mISNjbi5PGDyECfCFGJHOI00n4uiJ68R');

async function crearSetupIntent() {
  try {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['card'],
    });
    console.log('SetupIntent creado:', setupIntent.id);
    return setupIntent.client_secret; // Devuelve el client secret para utilizar en el frontend
  } catch (error) {
    console.error('Error al crear SetupIntent:', error);
    throw error;
  }
}
const paymentIntent = async () => {
    
    const res = await stripe.paymentIntents.create(
        
        {
        amount: 1000, // Monto en centavos
        currency: 'usd',
        payment_method: 'pm_card_visa', // Id del método de pago, como 'card_xxx'
        confirm: true
    })
    console.log(res)
}
  

export { crearSetupIntent, paymentIntent }
