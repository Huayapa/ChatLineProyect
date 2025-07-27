import { showMessage } from "../../../ui/showMessage.js"
import { validarCampos } from "../../../utils/validator.js"
import { registerAPI } from "./registerAPI.js";
export function initRegisterForm() {
  // Obtener el formulario
  const $form = document.getElementById("login_form");
  $form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    // 1. Obtener elementos
    const {username,   displayname, password} = $form;
    const usernameerror = $form.querySelector("#usernameerror");
    const displaynameerror = $form.querySelector("#displaynameerror");
    const passworderror = $form.querySelector("#passworderror");
    const successmessage = $form.querySelector("#successmessage");
    // 2. Validar formulario: username - displayname - password
    let isValid = true;
    isValid &= validarCampos({
      input: username,
      errorElement: usernameerror,
      name: "El usuario",
      min: 5
    });
    isValid &= validarCampos({
      input: displayname,
      errorElement: displaynameerror,
      name: "El nombre visible",
      min: 5
    });
    isValid &= validarCampos({
      input: password,
      errorElement: passworderror,
      name: "La contraseña es requerida",
      min: 5
    });
  
    //PROCESO DE ENVIO
    if(!isValid) return;
    showMessage(successmessage, "Enviando datos");
    const { ok, message } = await registerAPI(username.value, displayname.value, password.value);
      if(ok) {
        showMessage(successmessage, "Creando cuenta", "messagesuccess");
        window.location.href = "/";
      } else {
        showMessage(successmessage, message ?? "Error al crear cuenta", "messageerror");
      }
  })

}