import { socket } from "../../app/socket.js";
import { setChatActual } from "../../app/store.js";

export function obtenerChats() {
  socket.emit('chats:obtener');
}

export function enviarMensaje(msg) {
  socket.emit('mensaje enviado', {msg})
}

export function abrirChat(chat) {
  const chatActual = setChatActual({id:chat.id, type: chat.type})
  socket.emit('abrir_chat', chatActual);
}

export function mostrarIntegrantes() {
  socket.emit("integrantes:mostrar");
}
export function notificarIntegranteGrupo(idchat, typechat) {
  socket.emit("integrantes:nuevo", {id:idchat, type:typechat});
}

export function cambiarLecturaChat({messageId}) {
  socket.emit("lectura:chat", {messageId})
}
