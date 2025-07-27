import { initApp } from "./app/index.js";
import { initLoginForm } from "./features/auth/login/loginForm.js";
import { initRegisterForm } from "./features/auth/register/registerForm.js";

// Ruta actual
const path = window.location.pathname;

//Rutas
const routes = {
  '/': () => {
    initLoginForm();
  },
  '/register': () => {
    initRegisterForm();
  },
  '/chat': () => {
    initApp();
  }
}

const initRoute = routes[path];
if(initRoute) initRoute();
else console.warn("Ruta no encontrada", path);

