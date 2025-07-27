import { ChatController } from "../../controllers/chatController.js";
import { messageController } from "../../controllers/messageController.js";
import { cambiarEstadoUsuario } from "../../utils/estadoUsuario.js";
import { validateUserSocket } from "../../utils/validateSocketContext.js";

export function chatHandler(data) {
  const {socket, io, reset} = data;

  socket.on("abrir_chat",async ({id, type}) => {
    const userData = validateUserSocket(socket);
    if(!userData) return;
    try {
      // Guardar el chat actual en el socket
      socket.chatActual = { id, type };
      // Obtener mensajes por id
      const mensajes = await messageController.obtenerMensajes({
        toId: id,
        type: type,
        userid: userData.id,
        offsetId: 0
      });
      // Enviar los mensajes al cliente
      socket.emit("mensaje:lista", mensajes.map((msg) => ({
        ...msg,
        isMe: msg.userid === userData.id
      })));
      await cambiarEstadoUsuario(socket, userData.id, "online");
    } catch (err) {
      console.error("Error al abrir chat:", err.message);
    }
  })

  // Obtener los chats (grupos o conversaciones privadas)
  socket.on("chats:obtener", async () => {
    const userData = validateUserSocket(socket);
    if(!userData) return;
    try {
      const chats = await ChatController.obtenerListaDeChats(userData.id);
      //Guardar todas las salas que hay disponibles
      chats.forEach(chat => {
        const roomName = `${chat.type}:${chat.id}`;
        if(!socket.rooms.has(roomName)) socket.join(roomName);
      })
      //Enviar lista de chats disponibles 
      socket.emit("chats:lista", chats);
    } catch (err) {
      console.error("Error al obtener chats:", err.message);
      socket.emit('error', 'No se pudieron cargar tus chats.');
    }
  })
}
