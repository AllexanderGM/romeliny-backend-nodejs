import { Server } from 'socket.io';

let io;

let today = new Date();
let now = today.toLocaleString();

import chatdb from './db/chat.js';
const chat = new chatdb();

function initSocket(httpServer) {
  io = new Server(httpServer);
  setEvents(io);
}

function setEvents(io) {
  console.log('Configurando el socket');
  io.on('connection', async (socketClient) => {
    console.log('Se conecto el cliente con el id ', socketClient.id);

    socketClient.on('disconnect', () => {
      console.log('Cliente desconectado');
    });

    // Conexiones del chat

    socketClient.emit('setChat', await chat.listarTodos());

    socketClient.on('getChat', async (data) => {
      chat.nuevo(data);
      io.emit('setChat', await chat.listarTodos());
    });

    // está escribiendo...

    let dataTeclear = {
      correo: '',
      estado: false,
    };

    socketClient.emit('setTeclear', dataTeclear);

    socketClient.on('getTeclear', (data) => {
      dataTeclear.correo = data.correo;
      dataTeclear.estado = true;
      io.emit('setTeclear', dataTeclear);
      estaEscribiendo();
    });

    function estaEscribiendo() {
      setTimeout(() => {
        dataTeclear.estado = false;
        io.emit('setTeclear', dataTeclear);
      }, 1100);
    }

    io.emit('setTeclear', dataTeclear);
  });
}

export default initSocket;
