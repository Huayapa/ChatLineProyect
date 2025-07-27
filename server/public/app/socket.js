import {io} from 'https://cdn.socket.io/4.8.1/socket.io.esm.min.js'
import { getServerOffset } from './store.js';

export const socket = io(window.SOCKET_URL,{
  transports: ["websocket"],
  auth: {
    serverOffset: getServerOffset() //servira para saber hasta que mensaje nos quedamos
  },
  autoConnect: false
});