import { getListUsuarios } from "../../../app/store.js";
import { renderListUsersUI } from "./userListUI.js";

export function initUserSearchList() {
  const $inputsearch = document.getElementById("searchusers");
  if(!$inputsearch) return;
  $inputsearch.addEventListener("keyup", () => {
    const listausuarios = getListUsuarios();
    if(listausuarios.length <= 0) return;
    
    const term = $inputsearch.value.toLowerCase();
    
    const filtros = listausuarios.filter(u => u.username.toLowerCase().includes(term));
    renderListUsersUI(filtros);
  })
}