//Importar el modelo que usaremos para realizar sus funciones
import { groupModel } from "../models/groupModel.js";
import { messagesModel } from "../models/messagesModel.js"; //->Turso sql
import { PrivateModel } from "../models/privateModel.js";
import { usersModel } from "../models/usersModel.js";
import { ChatValidator, GroupValidation, UserValidation, Validations } from "../utils/validations.js";

export class messageController {
  static async obtenerMensajesDeGrupo(groupid) {
    GroupValidation.id(groupid);
    const result = await messagesModel.getMessagesGroup(groupid);
    if(!result) throw new Error("No se pudo recuperar mensajes de ese grupo");
    return result;
  }
  
  // FUNCIONES DE ENVIO DE MENSAJES
  // # Mensajes generales
  static async enviarMensajeGeneral({toid, type, msg, fromid}) {
    // 1. Verificar que los campos existan
    Validations.id(toid, "ID al quien se va enviar");
    Validations.requiredStr(type);
    ChatValidator.message(msg);
    UserValidation.id(fromid);

    // 2. Validar el tipo y dependiendo de ello enviara el mensaje
    switch (type) {
      case 'grupo': return this.#enviarMensajeDeGrupo(toid, msg, fromid);
      case 'privado': return this.#enviarMensajePrivado(toid, msg, fromid);
      default: throw new Error('El tipo de mensaje no esta soportado');
    }
  }

  
  // # Mensaje grupal
  static async #enviarMensajeDeGrupo(groupid, msg, senderid) {
    // 1. Verificar que el grupo exista
    const isExistedGroup = await groupModel.findGroupById(groupid);
    if(!isExistedGroup) throw new Error("Este grupo no existe"); 
    // 2. Verificar que el usuario este en el grupo
    const isMember = await groupModel.isMember(groupid ,senderid)
    if(!isMember) throw new Error("Usted no esta en este grupo");
    // 4. Enviar mensaje al grupo
    const result = await messagesModel.createMessagesGroup(groupid, msg, senderid);
    if(!result ) throw new Error("Usted no puede enviar mensaje a este grupo")
    return result;
  }

  // # Mensaje Privado
  static async #enviarMensajePrivado(conversationId, msg, senderid) {
    // 1. Verificar que el envia existaz  
    const userExiste = await usersModel.findUserById(senderid);
    if (!userExiste) throw new Error("El usuario no existe");
    // 2. Verificar que la conversacion privada exista
    const conversation = await PrivateModel.findConversationId(conversationId)
    if(!conversation) throw new Error("Esta conversacion no existe");
    // 3. Verificar que sea un usuario en la conversacion
    const participa = conversation.user1_id === senderid || conversation.user2_id === senderid;
    if (!participa) throw new Error("No tienes acceso a esta conversación");
    // 4. Enviar mensaje privado
    const result = await messagesModel.createMessagesPrivate(conversationId, msg, senderid);
    if(!result ) throw new Error("Usted no puede enviar mensaje a esta persona")
    return result;
  }


  // FUNCIONES DE OBTENERT MENSAJES
  static async obtenerMensajes({offsetId = 0, type, toId, userid}) {
    // 1. Validar campos
    Validations.id(toId, "ID al quien se va enviar");
    Validations.requiredStr(type);
    // 2. Validar typo 
    switch (type) {
      case 'grupo': return this.#obtenerMensajesGrupal(offsetId, toId, userid);
      case 'privado': return this.#obtenerMensajesPrivadas(offsetId, toId, userid);
      default: throw new Error('El tipo de mensaje no esta soportado');
    }
  }

  //# Mensaje grupal
  static async #obtenerMensajesGrupal(offsetId, groupid, senderid) {
    //1. Validar que el id del grupo exista
    const isExistedGroup = await groupModel.findGroupById(groupid);
    if(!isExistedGroup) throw new Error("Este grupo no existe"); 
    //2. Validar que el id del usuario este en el grupo
    const isMember = await groupModel.isMember(groupid ,senderid)
    if(!isMember) throw new Error("Usted no esta en este grupo");
    //3. obtener mensajes
    const result = await messagesModel.getMessagesGroup(groupid, offsetId);
    if(!result) throw new Error("No se pudo obtener la conversación de este grupo");
    return result
  }
  //# Mensaje privado
  static async #obtenerMensajesPrivadas(offsetId, conversationId, userId) {
    // 1. Verificar que la conversacion privada exista
    const conversation = await PrivateModel.findConversationId(conversationId)
    if(!conversation) throw new Error("Esta conversacion no existe");
    // 2. Verificar que sea un usuario en la conversacion
    const participa = conversation.user1_id === userId || conversation.user2_id === userId;
    if (!participa) throw new Error("No tienes acceso a esta conversación");
    
    
    // 3. Obtener los mensajes
    const result = await messagesModel.getMessagePrivate(conversationId, offsetId);
    if(!result) throw new Error("No se pudo obtener los mensajes de esta conversación");
    return result;
  }
}
