import { ChatController } from "../../controllers/chatController.js";
import { validateSocketContext, validateUserSocket } from "../../utils/validateSocketContext.js";

export function usersHandler(data) {
  const {socket, io, reset} = data;
  
  socket.on("integrantes:mostrar", async () => {
    const context = validateSocketContext(socket);
    if(!context) return;
    const {id, type, userData} = context;
    try {
      const integrantes = await ChatController.obtenerIntegrantesDechat(id, type, userData.id);
      //Enviar integrantes
      socket.emit("integrantes:lista", {idchat: id, typechat: type, integrantes});
    } catch (err) {
      console.error("Error al abrir chat:", err.message);
    }
  })

  // Pedimos el id y el tipo de donde se unio la persona
  socket.on("integrantes:nuevo", async ({id, type}) => {
    if(!id || !type) {
      return socket.emit("error", "No se pudo notificar que te unistes");
    }
    // Verificar que el usuario "token" es valido
    const userData = validateUserSocket(socket);
    if(!userData) return;
    try {
      const integrantes = await ChatController.obtenerIntegrantesDechat(id, type, userData.id);
      const room = `${type}:${id}`;
      if (!socket.rooms.has(room)) socket.join(room);
      //Enviar integrantes
      socket.to(room).emit("integrantes:lista", {idchat: id, typechat: type, integrantes});
    } catch (err) {
      console.error("Error al abrir chat:", err.message);
    }
  })
}