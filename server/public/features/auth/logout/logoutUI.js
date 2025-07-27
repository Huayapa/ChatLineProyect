import { showNotify } from "../../../ui/showNotify.js";
import { logoutAPI } from "./logoutAPI.js";

export function initLogoutUI() {
  const $btnlogout = document.getElementById("btn-logout");
  if(!$btnlogout) return;

  $btnlogout.addEventListener("click", async () => {
    const {ok, message} = await logoutAPI();
    if(ok) {
      showNotify(message);
      window.location.href = "/";
    } else {
      showNotify(message, "error");
    }
  })
}