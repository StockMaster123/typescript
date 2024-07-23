const stripe = require('stripe')('sk_test_51PRlUVP1qlt3s4ruOOt3Tftyrgy9c5Gbp9Zz7ZASFyb1xN1ZlcQpGIFGujEpko9UD9mISNjbi5PGDyECfCFGJHOI00n4uiJ68R');

const createUserStripe = async ( username:string, email:string ) => {
  try {
    // Busca clientes existentes con el correo proporcionado
    const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1,
    });

    if (existingCustomers.data.length > 0) {
        // Si ya existe un cliente con ese correo, devuelve el cliente existente
        return null
    } else {
        // Si no existe, crea un nuevo cliente
        const newCustomer = await stripe.customers.create({
            email: email,
            name: username,
            
        });
        return newCustomer;
    }
} catch (error) {
    console.error('Error al crear o buscar cliente:', error);
    throw error;
}
}
export { createUserStripe }