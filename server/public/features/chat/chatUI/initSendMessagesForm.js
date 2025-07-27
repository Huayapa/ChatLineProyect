import { enviarMensaje } from "../chatEmitters.js";

export function initSendMessagesForm() {
  const $form = document.getElementById("formmessage");
  if(!$form) return
  $form.addEventListener("submit", e => {
    e.preventDefault();
    const {message} = $form;

    if(!message) return
    if(message.value.trim().length < 3) {
      message.placeholder = "Inserte un mensaje mayor a 3 caracteres";
      return
    }
    message.placeholder = '';
    
    enviarMensaje(message.value);
    message.value = '';
  })
}