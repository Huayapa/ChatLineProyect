import { PrivateModel } from "../models/privateModel.js";
import { Validations } from "../utils/validations.js";

export class privateController {
  static async crearChatPrivado(userid1, userid2, createbyid) {
    //Validar campos
    Validations.id(userid1)
    Validations.id(userid2)
    if (userid1 === userid2) throw new Error("No puedes crear un chat privado contigo mismo.");
    //Ordenar el user
    const [user1, user2] = [userid1, userid2].sort();
    //Verificar que el usuario1 y el 2 ya no esten en una conversacion
    const isChatPrivate = await PrivateModel.findCreateConversationWithIds(user1, user2);
    if(isChatPrivate.rows[0]) {
      const {user1_id, user2_id, id} = isChatPrivate.rows[0];
      const userid = userid1 === user1_id ? user1_id : user2_id;
      await privateController.activarVisibilidadChat(userid, id)
      return id;
    }
    //Crear id
    const id = crypto.randomUUID();
    //Crear conversacion
    const result = await PrivateModel.createConversation(id, user1, user2, createbyid);
    if(!result) throw new Error("Ocurrio un problema al crear la conversacion")
    return id
  }

  static async activarVisibilidadChat(userid, conversationid) {
    // 1. Validar campos
    Validations.id(userid)
    Validations.id(conversationid)
    // 2. Verificar que exista la conversacion
    const conversation = await PrivateModel.findConversationId(conversationid);
    if(!conversation) throw new Error("No se encontro la conversacion");
    // 3. Obtener a que columna cambiara su estado
    const visibleUser = userid === conversation.user1_id ? "visible_user1" : (userid === conversation.user2_id) ? "visible_user2" : null;
    if(!visibleUser) throw new Error("El usuario no pertenece a la conversacion");
    // 4. Activar visibilidad de chat
    const result = await PrivateModel.updateVisibility(conversationid, visibleUser);
    if(!result) throw new Error("No se pudo activar la visibilidad del chat");
    return result
  }
}