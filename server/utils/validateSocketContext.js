import { getUserCookieSocket } from "./authsocket.js";

/**
 * Realiza validaciones necesarias antes de ejecutar la funcion principal del evento
 * Verifica que el chat actual exista y que el usuario este autentificado
 * 
 * @param {Socket} socket - Socket del cliente
 * @returns {null | {id:string, type:string, userData:Object}}
 * Retorna null si falla alguna validacion
 */
export function validateSocketContext(socket) {
  const {id, type} = socket.chatActual || {};
  if(!id || !type) {
    socket.emit("error", "No hay un chat activo para enviar mensajes.");
    return null;
  }

  const userData = validateUserSocket(socket);
  if(!userData) return null

  return {id, type, userData};
}

/**
 * Verifica que el usuario esta autentificado a travez de la cookie
 * @param {Socket} socket 
 * @returns {null | Object}
 */

export function validateUserSocket(socket) {
  const userData = getUserCookieSocket(socket);
  if(!userData) {
    socket.emit("error", "No estás autenticado.");
    return null;
  }
  return userData;
}