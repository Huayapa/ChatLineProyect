import { initLogoutUI } from "../features/auth/logout/logoutUI.js";
import { renovarTokenAPI } from "../features/auth/token/tokenAPI.js";
import { obtenerChats } from "../features/chat/chatEmitters.js";
import { registerChatListeners } from "../features/chat/chatListeners.js";
import { initChatMenuToggle } from "../features/chat/chatUI/initChatMenuToggle.js";
import { initSendMessagesForm } from "../features/chat/chatUI/initSendMessagesForm.js";
import { initGroupForm } from "../features/group/groupForm.js";
import { renderGroupList } from "../features/group/renderGroupListUI.js";
import { initModal } from "../ui/initModal.js";
import { showNotify } from "../ui/showNotify.js";
import { socket } from "./socket.js";

export function initApp() {
  // Conectar el socket
  socket.connect();
  // Cuando este listo el servidor
  socket.on("ready", () => {
    obtenerChats();
  })
  // Registrar listeners de features
  registerChatListeners();
  //Iniciar funciones del DOM
  initSendMessagesForm();
  initModal({dialogid: "creategroup", btnid: "btn-creategroup", onFunction: () => {
    initGroupForm();
  }})
  initModal({dialogid: "getgroup", btnid: "btn-getgroup", onFunction: () => {
    renderGroupList();
  }})
  initLogoutUI()
  initChatMenuToggle();
  // Listener globales de la aplicacion
  socket.on("error", (msg) => {
    showNotify(msg, "error");
    if(msg === "Token expirado, reconecta.") {
      window.location.href = "/";
    }
  })
  socket.on("disconnect", () => {
    console.warn("Desconectado del servidor");
  });
  //Si hay un error en el socket
  socket.on("connect_error", async (err) => {
    console.error("Error de conexión:", err.message);
    //Funcion para renovar token en caso de que sea el error
    if(err.message === "Token invalido") {
      //Intentar renovar token
      const isrenovado = await renovarTokenAPI();
      if(isrenovado.ok) {
        window.location.href = "/chat";
        // console.log("Token renovado. Reconectando socket...");
        // socket.connect(); // vuelve a conectar socket
      } else {
        console.warn("No se pudo renovar el token. Redirigiendo al login.");
        window.location.href = "/";
      }
    }
  });
}