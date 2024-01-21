
import express, { json, Router } from "express";
import cors from "cors"
import fs from "fs"

//Routes
import  { auth }  from "./routes/auth";
import  { user }  from "./routes/user";
import  { resetPassword }  from "./routes/resetpassword";
import  { packages }  from "./routes/package";
import  { order }  from "./routes/order";
import  { payment }  from "./routes/payment";





import http from 'http';
import { Server, Socket } from "socket.io";
import conectionDB from "./utils/conectionDB";
import { controllerSockets } from "./sockets/controller";
import { worker } from "./routes/worker";

const app = express()

const options = {
  key: fs.readFileSync('./privateKey.pem'),
  cert: fs.readFileSync('./certificate.pem'),
};

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });


app.use(cors())

const routers = Router()

const port = process.env.PORT || 200;

app.use(json())
app.use(auth) //usar router
app.use(user) //usar router
app.use(worker) //usar router
app.use(resetPassword) //usar router

app.use(order) //usar router
app.use(packages) //usar router
app.use(payment) //usar router


conectionDB()



app.use('/public', express.static(`${__dirname}/storage/img/product`))



io.on('connection',  (socket:Socket) => {
    controllerSockets(io, socket)
    
});

server.listen(port);

export { routers }