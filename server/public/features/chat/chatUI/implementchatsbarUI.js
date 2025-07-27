import { getChatActual, getChatsUsuarios, setChatActual, setServerOffset } from "../../../app/store.js";
import { abrirChat, mostrarIntegrantes } from "../chatEmitters.js";
import { implementChatBarUI} from "./implementchatbarUI.js";

export function implementChatsSidebarUI() {
  const listchats = getChatsUsuarios()
  const $listgroups = document.getElementById("groupsjoins");
  if (!$listgroups) return;
  $listgroups.innerHTML = ``;
  
  // 1. Renderizar elementos HTML
  listchats.forEach((data, index) => {
    implementChatBarUI(data)
  })

  //2. Implementar evento de clic para cambiar de chat grupal
  $listgroups.addEventListener("click", (e) => {
    //2.1. Aplicar visualmente que esta clickeado
    const clicked = e.target.closest(".chatlist");
    if (!clicked || clicked.classList.contains("active")) return;

    const $active = $listgroups.querySelector(".chatlist.active");
    if ($active) $active.classList.remove("active");

    clicked.classList.add("active");
    const {chatId, chatType, chatName} = clicked.dataset;

    //2.2. Actualizar el chat actual donde estamos
    setChatActual({id: chatId, type: chatType})

    //2.3. emit el chat que debe cargar y los integrantes
    const chatActual = getChatActual();
    abrirChat(chatActual);
    mostrarIntegrantes(chatActual)
    setServerOffset(0)
    
    // 2.4. Activar inputs
    const $formmessage = document.getElementById("formmessage")
    const {message, submit} = $formmessage;
    message.disabled = false;
    submit.disabled = false;
    // 2.5. Cambiar nombre de grupo
    const $namegroup = document.getElementById("namegroup");
    if(chatType == "grupo") {
      $namegroup.innerText = `Nombre grupo: ${chatName}`;
    } else {
      $namegroup.innerText = `Conversacion con: ${chatName}`;
    }
  });
}

