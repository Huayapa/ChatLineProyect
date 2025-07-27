import { getChatActual } from "../../../app/store.js";

export function implementChatBarUI(data) {
  const {id,name,type, countLastRead = 0} = data;
  const $listgroups = document.getElementById("groupsjoins");
  if (!$listgroups) return;
  // Crear Elemento
  const $li = document.createElement("li");
  $li.classList.add("chatlist");
  const chatActual = getChatActual();
  if (chatActual?.id === id && chatActual?.type === type) {
    $li.classList.add("active");
  }
  $li.dataset.chatId = id;
  $li.dataset.chatType = type;
  $li.dataset.chatName = name;
  $li.innerHTML = `
    ${name} <span class="badge" aria-label="${countLastRead} mensajes nuevos">${countLastRead}</span>
  `;
  $listgroups.appendChild($li);
}

export function updateCountChatBarUI({id, type, countLastRead}, modo = "set") {
  const $chatItem = document.querySelector(`#groupsjoins .chatlist[data-chat-id="${id}"][data-chat-type="${type}"]`);
  if (!$chatItem) return;
  const $spanBadge = $chatItem.querySelector(".badge")
  if (!$spanBadge) return;
  let actual = parseInt($spanBadge.textContent) || 0;
  let nuevoValor = modo === "incremento" ? actual + countLastRead : countLastRead;
  $spanBadge.textContent = nuevoValor;
  $spanBadge.setAttribute("aria-label", `${nuevoValor} mensajes nuevos`);
}