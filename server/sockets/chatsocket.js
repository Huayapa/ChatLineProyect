import { temporizadorAusente } from "./timers/userAway.js";
import { messageHandler } from "./handlers/messagehandlers.js";
import { chatHandler } from "./handlers/chathandler.js";
import { usersHandler } from "./handlers/usershandler.js";
import { cambiarEstadoUsuario } from "../utils/estadoUsuario.js";
import { readHandler } from "./handlers/readHandler.js";
import { userSpamData } from "../services/simpleAntiSpam.js";
import { usersConnections } from "../services/userConnections.js";
import { validateUserSocket } from "../utils/validateSocketContext.js";

/*
Ahora usamos io para el sevidor.
socket: referencia a una conexion en concreto
io: referencia a todas las conexiones
*/

export const chatIo = (io) => {
  io.on('connection', async (socket) => {
    const userData = validateUserSocket(socket);
    if(!userData)  {
      console.warn("Usuario no autenticado, desconectando socket.");
      return socket.disconnect();
    };
    usersConnections.addUser(userData.id, socket);
    userSpamData.initSocket(socket)
    // 3. Conectar usuario
    await cambiarEstadoUsuario(socket, userData.id, "online");
    // 4. Inicializar temporizador para marcar ausente o conectado
    const {reset, clear} = temporizadorAusente(socket, userData.id);
    reset();
    // 5. Handlers de  eventos
    messageHandler({socket, io, reset});
    chatHandler({socket, io, reset});
    usersHandler({socket, io, reset});
    readHandler({socket, io, reset});
    // 6. Desconexion 
    socket.on('disconnect', async () => {
      clear();
      usersConnections.deleteUser(userData.id);
      await cambiarEstadoUsuario(socket, userData.id, "desconectado");
    })
    socket.emit("ready")
  })
}