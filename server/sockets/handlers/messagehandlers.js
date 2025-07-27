import { ChatController } from "../../controllers/chatController.js";
import { messageController } from "../../controllers/messageController.js";
import { privateController } from "../../controllers/privateController.js";
import { MessageRateLimit } from "../../services/messageRateLimit.js";
import { userSpamData } from "../../services/simpleAntiSpam.js";
import { usersConnections } from "../../services/userConnections.js";
import { validateSocketContext } from "../../utils/validateSocketContext.js";

const rateLimit = new MessageRateLimit();

export function messageHandler(data) {
  const {socket, io, reset} = data;
  // ### MENSAJE DE ENVIO
  socket.on("mensaje enviado", async ({msg}) => {
    reset();
    if(!rateLimit.isAllowed(socket)) return
    if(!userSpamData.validateAntiSpam(socket, msg)) return;

    const context = validateSocketContext(socket);
    if(!context) return;
    const {id, type, userData} = context;

    try {
      // 1. Enviaremos el mensaje y lo registramos
      const message = await messageController.enviarMensajeGeneral({
        toid: id, //Puede ser el id del mensaje privado o al grupo
        type: type, // -> grupo - privado
        msg: msg,
        fromid: userData.id
      })
      // 1.5 Cargar chat privado si este no tenia mensajes
      if(type == "privado") {
        const otherUserId = await ChatController.obtenerOtroIntegranteIdConversacion(id, userData.id);
        const socketDestino = usersConnections.getSocketUserId(otherUserId);
        if(socketDestino) {
          const roomName = `${type}:${id}`;
          if(!socket.rooms.has(roomName)) {
            socket.join(roomName)
          }
          // Cambiar la visibilidad del otro chat
          await privateController.activarVisibilidadChat(otherUserId, id)
          socketDestino.emit("chat:conversacion-iniciada", {id, name: userData.display_name, type});
        }
      }
      // 2. Emitiremos al cliente el mensaje si es de grupo o privado
      const data = {
        idchat: message.chatid.toString(),
        typechat: type,
        userid: message.sender_id.toString(),
        content: message.content,
        display_name: userData.display_name,
        isMe: false,
        messageid: message.id.toString(),
        online: userData.online,
        timestamp: message.timestamp
      }
      const room = `${type}:${id}`;
      socket.to(room).emit("mensaje:nuevo", {...data, isMe: false})
      socket.emit("mensaje:nuevo", {...data, isMe: true})
    } catch (err) {
      console.error("Error al enviar mensaje", err);
      socket.emit("error", "No se pudo enviar el mensaje");
    }
  })


  // //### MENSAJE DE RECUPERACION
  // socket.on("mensajes:recuperar", async ({id, type}) => {
  //   const offsetid = socket.handshake.auth.serverOffset ?? 0;
  //   // Verificar que el usuario "token" es valido
  //   const userData = getUserCookieSocket(socket);
  //   if(!userData) {
  //     return socket.emit("error", "Token expirado, reconecta.");
  //   }
  //   try {
  //     const mensajes = await messageController.obtenerMensajes({
  //       toId: id,
  //       type: type,
  //       userid: userData.id,
  //       offsetId: offsetid
  //     })
  //     socket.emit("mensaje:lista", mensajes.map((msg) => ({
  //       ...msg,
  //       isMe: msg.userid === userData.id
  //     })));
  //   } catch (err) {
  //     console.error("Error al recuperar mensajes",err)
  //     socket.emit("error", "No se pudieron recuperar los mensajes");
  //   }
  // })
}