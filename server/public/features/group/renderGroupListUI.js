import { notificarIntegranteGrupo, obtenerChats } from "../chat/chatEmitters.js";
import { getGroups, joinGroupAPI } from "./groupAPI.js";
import { showNotify} from "../../ui/showNotify.js";

export async function renderGroupList() {
  //1. Verificar que esta el elemento
  const $listgroups = document.getElementById("listgroups");
  if (!$listgroups) return;
  //2. Obtener todos los grupos
  const grupos = await getGroups();
  //3. Renderizar lista de grupos disponibles
  $listgroups.innerHTML = '';
  grupos.forEach(({id, name, display_name, description, create_at}) => {
    const item = `<li class="grupolist" data-groupid="${id}">
    <div>
      <h4 class="title">${name}</h4>
      <p>${description}</p>
      <small>${create_at}</small>
    </div>
    <button class="btn-unirse">Unirse</button>
    </li>`;
    $listgroups.insertAdjacentHTML('beforeend', item)
  });
  //4. Activar eventos de cada boton
  const $btngrupos = document.querySelectorAll(".btn-unirse");
  $btngrupos.forEach((btngrupo) => {
    btngrupo?.addEventListener("click", async () => {
      // 5. Unirse a el grupo
      const idGroup = btngrupo.closest(".grupolist").dataset.groupid;
      const {ok, message} = await joinGroupAPI(idGroup);
      if(ok) {
        showNotify("Se unio al grupo");
        //Recargar los chats
        obtenerChats()
        //Emitir a los demas que se unio
        notificarIntegranteGrupo(idGroup, "grupo")
      } else {
        showNotify(message, "error")
      }
    })
  })
}