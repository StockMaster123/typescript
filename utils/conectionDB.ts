import { connect } from "mongoose"

const conectionDB = () =>{
    connect("mongodb+srv://StockMaster123:23042001RmaOm@cluster0.pccbzus.mongodb.net/DataBase")
    .then((e) => console.log('Conectado a BD'))
    .catch((err) => console.warn(err))
}

export default conectionDB