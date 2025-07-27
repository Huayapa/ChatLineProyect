import { formatShortTime } from "../../../utils/shorTime.js";
import { estados } from "../../../utils/status.js";
import { openChatUserPrivate } from "./openChatUserPrivateUI.js";

export function renderListUsersUI(listusers) {
  if(!Array.isArray(listusers)) return;
  const $chatlist = document.getElementById('chatuserslist');
  if(!$chatlist) return;
  $chatlist.innerHTML = '';
  listusers.forEach(user => {
    renderListUserUI(user)
  })
}

export function renderListUserUI(user) {
  const {id, displayname, username, online, joinedat, role = "Ninguno", lastseen} = user;
  //1. Validar que exista el elemento HTML
  const $chatlist = document.getElementById('chatuserslist');
  if(!$chatlist) return;
  //2. Estructurar elemento
  const $li = document.createElement("li");
  $li.classList.add("chatuser");
  $li.dataset.userid = id;

  $li.innerHTML = `
    <div aria-label="status_connect" class="statusmessage ${estados[online]}"></div>
    <section>
      <p class="name">
        ${username} - @${displayname}
      </p>
    </section>
  `;
  //2. Ver si se mostrar la fecha o no
  if(online != 1) {
    //2.1 Formatear la fecha corta
    const lastSeenStr  = lastseen ? formatShortTime(lastseen)  : '—';
    //2.2 Incluir elemento
    $li.querySelector(".name").insertAdjacentHTML("afterend", `<small>Ult vez: ${lastSeenStr}</small>`)
    
  }
  //4. Activar evento para mostrar detalles y se puede hablar privado
  $li.addEventListener("click", () => {
    openChatUserPrivate(user)
  })
  //5. Añadir elemento a la lista general
  $chatlist.appendChild($li)
}