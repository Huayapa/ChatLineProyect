import { userController } from "../controllers/userController.js";
/**
 * Cambia el estado del usuario.
 * @param {Socket} socket - El socket del usuario
 * @param {string} userId - El id del usuario
 * @param {'online' | 'ausente' | 'desconectado'} [estado='desconectado'] - Estado a cambiar del usuario.
*/
export async function cambiarEstadoUsuario(socket, userId, estado = 'desconectado') {
  const estados = {
    'desconectado': 0,
    'online': 1,
    'ausente': 2,
  }
  try {
    if(!(estado in estados)) throw new Error(`Estado inválido recibido: ${estado}`);

    const isValid = await userController.cambiarEstadoUsuario(userId, estado);
    if(!isValid) throw new Error("No se pudo cambiar de estado");

    // Emitir a todos que alguien cambio de estado
    socket.broadcast.emit('usuarioestado:cambio', {userId, status: estados[estado]})
    // Emitir al usuario actual
    socket.emit('estadouser', {userId, status: estados[estado]})
  } catch (err) {
    console.error("Error al cambiar estado", err.message);
  }
}