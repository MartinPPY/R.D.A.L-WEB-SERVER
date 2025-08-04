import app from "./app.js";
import http from 'http';
import { Server } from "socket.io";
import { setupSocketIO } from "./servicios/socketManager.js";

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const io = new Server(httpServer);

setupSocketIO(io);

httpServer.listen(PORT,()=>{
    console.log('Servidor web en el puerto:',PORT)
});
