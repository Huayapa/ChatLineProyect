import { getListUsuarios, setListUsuarios } from "../app/store.js";
import { updateOtherUserStatusUI } from "../features/chat/chatUI/userStatusUI.js";
import { estados } from "./status.js";

export function actualizarEstadoUsuario(userId, status) {
  
  updateOtherUserStatusUI(userId,estados[status])

  const listaUsuarios = getListUsuarios();
    const newListUsers = listaUsuarios.map((usuario) => {
      if(userId === usuario.id) {
        return {...usuario, online: status}
      }
      return usuario;
    })
    setListUsuarios(newListUsers)
}