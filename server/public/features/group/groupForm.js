import { showMessage } from "../../ui/showMessage.js";
import { validarCampos } from "../../utils/validator.js";
import { obtenerChats } from "../chat/chatEmitters.js";
import { createGroupAPI } from "./groupAPI.js";

export function initGroupForm() {
  // 1. Obtener formulario
  const $formcreategroup = document.getElementById("formcreategroup");
  if(!$formcreategroup) return;
  // 2. Obtener los elementos pára mostrar errores
  const err_namegroup = document.getElementById("error_namegroup");
  const err_descriptiongroup = document.getElementById("error_descriptiongroup");
  const submitmessage = document.getElementById("submitmessage");
  // 3. Activar evento de envio
  $formcreategroup.addEventListener("submit", async (e) => {
    e.preventDefault();
    const {namegroup, descriptiongroup} = $formcreategroup;
    // 4. Validar datos
    let isValid = true;
    isValid &= validarCampos({
      input: namegroup,
      errorElement: err_namegroup, 
      name: "El nombre",
      min: 5
    });
    isValid &= validarCampos({
      input: descriptiongroup,
      errorElement: err_descriptiongroup, 
      name: "La descripcion",
      min: 5
    });
    // 5. Crear grupo 
    if(!isValid) return;
    showMessage(submitmessage, "Creando Grupo...");
    const {ok, message} = await createGroupAPI(namegroup.value, descriptiongroup.value);
    // 7. Validar peticion
    if(ok) {
      showMessage(submitmessage, "Grupo creado correctamente.")
      // 3. Actualizar la lista de chats
      obtenerChats();
      // 4. Limpiar inputs
      namegroup.value = '';
      descriptiongroup.value = '';
    } else {
      showMessage(submitmessage, message ?? "Error al iniciar sesión", "messageerror")
    }
  });
}