export interface Users {
    uid: string,
    img: string,
    username : string,
    email : string,
    password : string,
    rol : 'cliente' | 'proveedor' | 'administrador' 
}