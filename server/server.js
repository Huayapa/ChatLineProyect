import express from 'express';
// Socket.io permitira la comunicacion en tiempo real y bidireccional entre cliente - servidor
import { Server } from 'socket.io'; // io= in out 
//Modulo para crear servidores http y que se pueda usar con express y socket.io
import { createServer } from 'node:http'
//Leer variables de entorno
import dotenv from 'dotenv'
import { chatIo } from './sockets/chatsocket.js';
import { indexroutes } from './routes/index.js';
import { PORT } from './config/config.js';
import { jsonParser } from './middleware/jsonParse.js';
import { loggerParser } from './middleware/logger.js';
import { cookieParse } from './middleware/cookieparse.js';
import { tokensession } from './middleware/token.js';
import path from 'path';
import { getUserCookieSocket } from './utils/authsocket.js';

dotenv.config();

const app = express();
app.disable("x-powered-by")
app.use(express.static(path.join(process.cwd(), 'server/public'))); // Hacer publico la carpeta
app.set('view engine', 'ejs')
app.set('views', path.join(process.cwd(), 'server/views')); // Ubicacion de vistas
//middelware app
app.use(jsonParser);
app.use(cookieParse);
app.use(tokensession);

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {} //recuperar datos cuando no haya conexion
})
//app es para crear la aplicacion express
app.use(loggerParser)
app.use('/', indexroutes);
//Middelware io
io.use((socket, next) => {
  const user = getUserCookieSocket(socket);
  if(!user) return next(new Error("Token invalido"))
  next();
})
//Enviar el io al chat donde se usara el socket io
chatIo(io)

//Inicializar servidor, ya no usamos app porque escucharemos al servidor y no la aplicacion
server.listen(PORT, (req, res) => {
  console.log(`Servidor en el puerto ${PORT}`);
})