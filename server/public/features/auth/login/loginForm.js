import { loginAPI } from "./loginAPI.js";
import { showMessage } from "../../../ui/showMessage.js"
import { validarCampos } from "../../../utils/validator.js"
export function initLoginForm() {
  // Obtener el formulario
  const $form = document.getElementById("login_form");
  $form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    // 1. Obtener elementos
    const {username, password} = $form;
    const usernameerror = $form.querySelector("#usernameerror");
    const passworderror = $form.querySelector("#passworderror");
    const successmessage = $form.querySelector("#successmessage");
    // 2. Validar username - password
    let isValid = true;
    isValid &= validarCampos({
      input: username,
      errorElement: usernameerror, 
      name: "El usuario",
      min: 5
    })
    isValid &= validarCampos({
      input: password,
      errorElement: passworderror,
      name: "La contraseña",
      min: 7
    })
    // 3.Enviar peticion
    if(!isValid) return;
    showMessage(successmessage, "Enviando datos");
  
    const { ok, message } = await loginAPI(username.value, password.value);
    if(ok) {
      showMessage(successmessage, "Sesión Enviada, Ingresando", "messagesuccess");
      window.location.href = "/chat";
    } else {
      showMessage(successmessage, message ?? "Error al iniciar sesión", "messageerror");
    }
  })
}