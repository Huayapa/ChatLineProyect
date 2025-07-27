/**
 * @type {Object<string, string|null>}
 * @description Representa la conversación que el usuario tiene actualmente abierta.
*/

export const chatActual = {
  id: null,
  type: null
};

// FUNCIONES DE CHATACTUAL
export function getChatActual() {
  return chatActual;
}
export function setChatActual({id, type}) {
  chatActual.id = id;
  chatActual.type = type;
  return chatActual
}
export function resetChatActual() {
  chatActual.id = null;
  chatActual.type = null;
}

/**
 * @type {Array<Object>}
 * @description Array de objetos que representan los usuarios disponibles o participantes del grupo o chat.
 */
export let listaUsuarios = [];

//FUNCIONES DE LISTA USUARIO
export function getListUsuarios() {
  return listaUsuarios;
}
export function setListUsuarios(newList) {
  listaUsuarios = newList;
}
export function addListUsuario(usuario) {
  listaUsuarios.push(usuario);
}
export function clearListUsers() {
  listaUsuarios = [];
}

/**
 * @type {number}
 * @description Se usa para indicar en que posicion del chat estas (de esta forma solicitar lo necesario).
*/
export let serverOffset = 0;

//FUNCIONES PARA SERVEROFFSET
export function getServerOffset() {
  return serverOffset;
}

export function setServerOffset(value) {
  serverOffset = value;
}

/**
 * @type {Array<{
 *   id: string,
 *   name: string,
 *   type: "privado" | "grupo",
 *   countLastRead: number
 * }>}
 * @description Lista de chats disponibles (privados o grupales) con conteo de mensajes no leídos.
*/
let chatsUsuarios = [];

//Funciones
export function getChatsUsuarios() {
  return chatsUsuarios;
}

export function setChatsUsuarios(newChatsUsers) {
  chatsUsuarios = newChatsUsers;
}

export function addChatUsuario(chat) {
  chatsUsuarios.push(chat);
}

export function removeChatUsuario(chatId) {
  chatsUsuarios = chatsUsuarios.filter(chat => chat.id !== chatId)
}

export function updateNotifyChatUsuario({id, type, countLastRead}) {
  chatsUsuarios = chatsUsuarios.map((data) => {
    if(data.id === id && data.type === type) {
      data.countLastRead = countLastRead;
    }
    return data
  })
}