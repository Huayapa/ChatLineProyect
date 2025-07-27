import { createChatPrivateAPI } from "../chatAPI/privateChatAPI.js";
import {showNotify} from "../../../ui/showNotify.js";
import { obtenerChats } from "../chatEmitters.js";
import { formatShortTime } from "../../../utils/shorTime.js";

export async function openChatUserPrivate(user) {
  const {id, displayname, username, online, joinedat, role = "Ninguno", lastseen} = user;
  const lastSeenStr  = lastseen  ? formatShortTime(lastseen)  : '—';
  //1. Validar elementos HTML modal
  const modal = document.getElementById("modaluser");
  if(!modal) return;
  //2. Renderizar datos de usuario
  const divuser = modal.querySelector("#userinfo");
  divuser.innerHTML = `
  <h3>${displayname} - @${username}</h3>
  <div>
  <p>Rol: ${role}</p>
  <p>Últ vez: ${lastSeenStr}</p>
  </div>
  <button id="btnStartChat">Hablar</button>
  `;
  //3. Activar evento para enviar
  const btnStartChat = document.getElementById("btnStartChat");
  btnStartChat.addEventListener("click", async () => {
    // 4. Validar resultado
    const {ok, message} = await createChatPrivateAPI(id);
    if(ok) {
      showNotify("Conversacion iniciada");
      obtenerChats();
    } else {
      showNotify(message ?? "Error al crear un chat privado.", "error");
    }
    modal.close();
  })
  //5. Mostrar modal
  modal.showModal();
}