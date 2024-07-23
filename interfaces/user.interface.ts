export interface Users {
    uid: string,
    img: string,
    username : string,
    email : string,
    password : string,
    socketId: string,
    stripeId: string,
    rol : 'cliente' | 'proveedor' | 'administrador' 
}