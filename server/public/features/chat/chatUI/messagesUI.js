import { setServerOffset } from "../../../app/store.js";
import { cambiarLecturaChat } from "../chatEmitters.js";

export function renderMessagesUI(listMessages) {
  if(!Array.isArray(listMessages)) return;
  const $messages = document.getElementById('messages');
  if(!$messages) return;
  $messages.innerHTML = '';
  if(listMessages.length <= 0) {
    $messages.innerHTML = '<li class="msg">Empieza esta conversacion :D.</li>';
    cambiarLecturaChat({messageId: 0})
  } else {
    listMessages.forEach((msg) => {
      renderMessageUI(msg)
    })
    const lastMsg = listMessages[listMessages.length - 1];
    if(lastMsg?.messageid) {
      cambiarLecturaChat({messageId: lastMsg.messageid})
    }
  }
}

export function renderMessageUI(message) {
  const {userid, content, display_name, isMe, messageid, online, timestamp} = message;
  const $messages = document.getElementById('messages');
  if(!$messages) return;
  if($messages.querySelector(".msg")) {
    $messages.innerHTML = '';
  }
  // <div class="statusmessage ${estados[online]}"></div>
  let nameclass = isMe ? "me" : "you";
  const item = `<li class="${nameclass}">
    <small >${display_name} </small>
    <p>${content}</p>
  </li>`;
  $messages.insertAdjacentHTML('beforeend', item);
  setServerOffset(messageid);
  //Scroll a nuevos mensajes
  $messages.scrollTop = $messages.scrollHeight;
}