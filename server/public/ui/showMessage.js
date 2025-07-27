/**
 * @param {HTMLElement} span - Elemento donde se pone el mensaje
 * @param {String} message - Mensaje
 * @param {string} classadd - clase que se añadira a el elemento
 * @returns 
 */

export function showMessage(span, message, classadd='') {
  if(!(span instanceof HTMLElement)) return;
  span.textContent = message;
  span.className = classadd;
}