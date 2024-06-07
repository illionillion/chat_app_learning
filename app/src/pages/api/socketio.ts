import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket as NetSocket } from 'net';
import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import type { Socket, Server as IOServer } from 'socket.io';

interface SocketServer extends HttpServer {
  io?: IOServer;
}

interface SocketServerWithIO extends NetSocket {
  server: SocketServer;
}

interface ResponseWithSocket extends NextApiResponse {
  socket: SocketServerWithIO;
}

export default function socketHandler(
  req: NextApiRequest,
  res: ResponseWithSocket,
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  if (res.socket.server.io) {
    return res.send('server is already running');
  }
  console.log('Socket is initializing');
  const io = new Server(res.socket.server, { addTrailingSlash: false });
  res.socket.server.io = io;

  // コネクション確立
  io.on('connection', (socket: Socket) => {
    console.log(socket.id);

    socket.on('onSubmit', () => {
      console.log('from client: onSubmit');
      io.emit('sync');
    });

    // 切断イベント受信
    socket.on('disconnect', (reason) => {
      console.log(`user disconnected. reason is ${reason}.`);
    });
  });
  res.socket.server.io = io;

  res.end();
}
