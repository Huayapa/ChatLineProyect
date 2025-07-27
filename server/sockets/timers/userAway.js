import { cambiarEstadoUsuario } from "../../utils/estadoUsuario.js";


/*
 * Esta funcion permitira ausentar al usuario

 * La base de esto es tener un temporizador que se reinicie cuando haya actividad en el web socket
 * reset: En caso de que pase el limite, la funcion de cambiar a ausente se realizara
 * clear: Y si se desconecta podras limpiar el temporizador para que no haga nada.
*/
export const temporizadorAusente = (
  socket,
  userId,
  limite = 60 * 10000 //Temporizador de 10 minuto
) => {
  let timer; 
  const setAway = async () => {
    await cambiarEstadoUsuario(socket, userId, "ausente")
  }
  const reset = async () => {
    clearInterval(timer);
    timer = setInterval(setAway, limite);
    //Esto estara conectado hasta que el "timer" se active
    cambiarEstadoUsuario(socket, userId, "online")
  }

  const clear = () => {
    clearTimeout(timer);
  };

  return { reset, clear };
}