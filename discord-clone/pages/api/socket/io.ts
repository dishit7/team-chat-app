// io.ts

import {NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIo } from '@/types';
import {Server as NetServer} from "http"
import { io } from 'socket.io-client';
export const config={
    api:{
        bodyParser:false
    }
}

const ioHandler=(req:NextApiRequest,res:NextApiResponseServerIo)=>{
    if(!res.socket.server.io){
        const path="/api/socket/io" ;
        const httpServer:NetServer =res.socket.server as any;
        const io=new ServerIO(httpServer,{
             path:path,
            addTrailingSlash:false,
            pingTimeout: 60000,
            maxHttpBufferSize: 1e8,
             
        })
        
        res.socket.server.io=io

       // WebRTC signaling handlers
        io.on("connection", (socket) => {
            console.log("New client connected", socket.id);

            // Handle the "offer" event - sent by the peer who wants to initiate a connection
            socket.on("offer", (data) => {
                console.log("Offer received from", data.from);
                // Send the offer to the recipient peer
                socket.to(data.to).emit("offer", data);
            });

            // Handle the "answer" event - sent by the peer who receives the offer
            socket.on("answer", (data) => {
                console.log("Answer received from", data.from);
                // Send the answer to the peer who made the offer
                socket.to(data.to).emit("answer", data);
            });

            // Handle the "ice-candidate" event - for exchanging ICE candidates
            socket.on("ice-candidate", (data) => {
                console.log("ICE Candidate received from", data.from);
                // Send the ICE candidate to the other peer
                socket.to(data.to).emit("ice-candidate", data);
            });

            // Handle client disconnecting
            socket.on("disconnect", () => {
                console.log("Client disconnected", socket.id);
            });
        });


        io.engine.on("connection_error", (err) => {
            console.log("connection error")
            console.log(err.code);     // 3
            console.log(err.message);  // "Bad request"
            console.log(err.context);  // { name: 'TRANSPORT_MISMATCH', transport: 'websocket', previousTransport: 'polling' }
          });
    }
    
     res.end()

}

export default ioHandler