import { chatReadController } from "../../controllers/chatReadController.js";
import { validateSocketContext } from "../../utils/validateSocketContext.js";


export function readHandler(data) {
  const {socket, io, reset} = data;
  socket.on('lectura:chat', async ({messageId}) => {
    const context = validateSocketContext(socket);
    if(!context) return;
    const {id, type, userData} = context;
    try {
      await chatReadController.cambiarLecturaChat(userData.id, id, messageId, type);
      const result = await chatReadController.contarLecturaChat(userData.id, id, type);
      socket.emit('lectura:cambio', {id, type, countLastRead: result.unread});
      reset()
    } catch (err) {
      console.error("Error en lectura:chat", err.message);
      socket.emit("error", err.message || "Error en lectura del chat");
    }
  }); 
}