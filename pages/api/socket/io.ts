import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIo } from '@/types';
import { Server as NetServer } from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      transports: ['websocket', 'polling'],
      addTrailingSlash: false,
      pingTimeout: 60000,
      maxHttpBufferSize: 1e8,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

     
    io.on('connection', (socket) => {
      console.log("New client connected", socket.id);

      socket.on('join-channel', (channelId) => {
        socket.join(channelId);
        console.log(`Client ${socket.id} joined channel ${channelId}`);
        socket.to(channelId).emit('user-joined');
c
      });

      socket.on('leave-channel', (channelId) => {
        socket.leave(channelId);
        console.log(`Client ${socket.id} left channel ${channelId}`);
      });

      socket.on('offer', ({ channelId, offer }) => {
        socket.to(channelId).emit('offer', { offer });
      });

      socket.on('answer', ({ channelId, answer }) => {
        socket.to(channelId).emit('answer', { answer });
      });

      socket.on('ice-candidate', ({ channelId, candidate }) => {
        socket.to(channelId).emit('ice-candidate', { candidate });
      });

       
      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
      });
    });

    io.engine.on("connection_error", (err) => {
      console.log("connection error", err);
    });
  }

  res.end();
};

export default ioHandler;
