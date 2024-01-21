import { connect } from "mongoose"
         
const dbConnection = async () =>  {   

     await connect("mongodb+srv://StockMaster123:23042001RmaOm@cluster0.pccbzus.mongodb.net/DataBase", )             
     
}
export default dbConnection