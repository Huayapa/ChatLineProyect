import { socket } from "../../app/socket.js";
import { addChatUsuario, getChatActual, getChatsUsuarios, getListUsuarios, setChatsUsuarios, setListUsuarios, updateNotifyChatUsuario } from "../../app/store.js";
import { showNotify } from "../../ui/showNotify.js";
import { estados } from "../../utils/status.js";
import { actualizarEstadoUsuario } from "../../utils/statusUser.js";
import { cambiarLecturaChat } from "./chatEmitters.js";
import { implementChatBarUI, updateCountChatBarUI } from "./chatUI/implementchatbarUI.js";
import { implementChatsSidebarUI } from "./chatUI/implementchatsbarUI.js"
import { renderMessagesUI, renderMessageUI } from "./chatUI/messagesUI.js";
import { renderListUsersUI } from "./chatUI/userListUI.js";
import { initUserSearchList } from "./chatUI/userSearchListUI.js";
import { updateUserStatusUI } from "./chatUI/userStatusUI.js";

export function registerChatListeners() {
  socket.on('chats:lista', (chats) => {
    setChatsUsuarios(chats)
    implementChatsSidebarUI();
  })

  socket.on("mensaje:nuevo", (msg) => {
    const {idchat, typechat, messageid} = msg;
    // 1. obtener en que grupo estamos actualmente
    const {id, type} = getChatActual();
    // 2. Verificar si el nuevo mensaje pertenece al grupo donde estamos
    if(id === idchat && type === typechat) {
      renderMessageUI(msg);
      cambiarLecturaChat({messageId: messageid})
    } else {
      showNotify("Tienes un mensaje");
      updateCountChatBarUI({id: idchat, type: typechat, countLastRead: 1}, "incremento")
    }
  })
  
  socket.on("integrantes:lista", (lista) => {
    const {id, type} = getChatActual()
    const {idchat, typechat} = lista;
    if(id === idchat && type === typechat) {
      setListUsuarios(lista.integrantes)
      const listaUsuarios = getListUsuarios();
      console.log(listaUsuarios);
      
      renderListUsersUI(listaUsuarios);
      initUserSearchList();
    }
  })

  socket.on("mensaje:lista", (data) => {
    renderMessagesUI(data);
  })

  socket.on('estadouser', ({userId,status}) => {
    updateUserStatusUI(estados[status])
    actualizarEstadoUsuario(userId, status)
  })

  socket.on('usuarioestado:cambio', ({userId, status}) => {
    //Actualizar el estado en la lista de usuarios
    actualizarEstadoUsuario(userId, status)
  })

  socket.on('chat:conversacion-iniciada', ({id, name, type}) => {
    const listaUsuarios = getChatsUsuarios().filter((user) => user.id == id && user.type == type);
    if(!listaUsuarios[0]) {
      addChatUsuario({id, type, name, countLastRead: 0})
      implementChatBarUI({id, name, type})
    }
  })

  socket.on('lectura:cambio', ({id, type, countLastRead}) => {
    updateNotifyChatUsuario({id, type, countLastRead})
    updateCountChatBarUI({id, type, countLastRead})
  });
}                                