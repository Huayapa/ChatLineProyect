/**
 * Iniciar modal
 * @param {object} data 
 * @param {string} data.dialogid - Id del Elemento dialog
 * @param {string} data.btnid - Id del boton que activara la modal
 * @param {Function} [data.onFunction] - Función opcional a ejecutar cuando se hace clic en el botón
 */ 
export function initModal({dialogid,btnid,onFunction = () => {}}) {
  const $dialog = document.getElementById(dialogid),
    $btn = document.getElementById(btnid);
  if(!$dialog || !$btn) return;
  $btn.addEventListener("click", () => {
    onFunction(); // Ejecuta callback si se define
    $dialog.showModal()
  })
}