import { chatReadModel } from "../models/chatReadModel.js";
import { groupModel } from "../models/groupModel.js";
import { PrivateModel } from "../models/privateModel.js";
import { usersModel } from "../models/usersModel.js";
import { ChatValidator, GroupValidation, UserValidation, Validations } from "../utils/validations.js";

export class chatReadController {
  // * Chat general
  static async cambiarLecturaChat(userId, chatId, messageId, type) {
    //1. Validar campos
    UserValidation.id(userId);
    Validations.id(chatId)
    if(messageId === null || messageId === undefined) throw new Error("Error en el id del mensaje");
    Validations.requiredStr(type);
    //2. Verificar que exista el usuario
    const user = await usersModel.findUserById(userId)
    if(!user) throw new Error("No se encontro el usuario " + userId);
    //3. Cambiar la lectura del chat o conversacion
    switch (type) {
      case "grupo": return this.#cambiarLecturaGrupo(userId, chatId, messageId);
      case "privado": return this.#cambiarLecturaPrivado(userId, chatId, messageId);
      default: throw new Error('El tipo de chat no es valido');
    }
  }

  static async contarLecturaChat(userId, chatId, type) {
    //1. Validar campos
    UserValidation.id(userId);
    Validations.id(chatId)
    Validations.requiredStr(type);
    //2. Verificar que exista el usuario
    const user = await usersModel.findUserById(userId)
    if(!user) throw new Error("No se encontro el usuario " + userId);
    //3. Contar la lectura del chat o conversacion
    switch (type) {
      case "grupo": return this.#contarLecturaGrupo(userId, chatId);
      case "privado": return this.#contarLecturaPrivado(userId, chatId);
      default: throw new Error('El tipo de chat no es valido');
    }
  }
  // * Grupo chat
  static async crearLecturaGrupoChat(userId, groupId, messageId) {
    // 1. Validar que campos
    GroupValidation.id(groupId);
    UserValidation.id(userId);
    ChatValidator.id(messageId);
    // 2. Verificar que existan
    // 2.1 Usuario
    const user = await usersModel.findUserById(userId);
    if(!user) throw new Error("No se encontro el usuario " + userId);
    // 2.2 Grupo 
    const group = await groupModel.findGroupById(groupId);
    if(!group) throw new Error("No se encontro el grupo " + groupId);
    // 2.3 Usuario este en grupo
    const isMember = await groupModel.isMember(groupId, userId);
    if(!isMember) throw new Error("El usuario no pertenece al grupo");
    // 3. Crear lectura del grupo
    const result = await chatReadModel.createGroupRead(userId, groupId, messageId);
    if(!result) throw new Error("No se pudo crear el registro de lectura del grupo");
    return result;
  }
  static async #cambiarLecturaGrupo(userId, groupId, messageId) {
    //1. Verificar que el grupo exista
    const group = await groupModel.findGroupById(groupId)
    if(!group) throw new Error("No se encontro el grupo " + groupId);
    //2. Verificar que el usuario pertenece al grupo
    const isMember = await groupModel.isMember(groupId, userId);
    if(!isMember) throw new Error("El usuario no pertenece al grupo");
    //3. Cambiar lectura
    const result = await chatReadModel.setGroupRead(userId, groupId, messageId);
    if(!result) throw new Error("No se pudo cambiar la lectura del chat grupal");
    return result
  }
  static async #contarLecturaGrupo(userId, groupId) {
    //1. Verificar que el grupo exista
    const group = await groupModel.findGroupById(groupId)
    if(!group) throw new Error("No se encontro el grupo " + groupId);
    //2. Verificar que el usuario pertenece al grupo
    const isMember = await groupModel.isMember(groupId, userId);
    if(!isMember) throw new Error("El usuario no pertenece al grupo");
    //3. contar los mensajes que faltan ver
    const result = await chatReadModel.countUnReadGroup(userId, groupId);
    if(!result) throw new Error("No se pudo contar el chat grupal");
    return result
  }
  // * Privado chat
  static async crearLecturaPrivadoChat(userId, conversationId, messageId) {
    // 1. Validar que campos
    Validations.id(conversationId);
    UserValidation.id(userId);
    ChatValidator.id(messageId);
    // 2. Verificar que exista
    // 2.1 Usuario
    const user = await usersModel.findUserById(userId);
    if(!user) throw new Error("No se encontro el usuario " + userId);
    // 2.2 Conversacion 
    const conversation = await PrivateModel.findConversationId(conversationId);
    if(!conversation) throw new Error("No se encontro la conversacion " + conversationId);
    // 2.3 Usuario pertenezca a conversacion
    const isConversation = await PrivateModel.isUserConversation(userId, conversationId);
    if(!isConversation) throw new Error("El usuario no pertenece a esa convesación")
    // 3. Crear lectura para el chat privado
    const result = await chatReadModel.createPrivateRead(userId, conversationId, messageId);
    if(!result) throw new Error("No se pudo crear el registro de lectura para la conversación");
    return result;
  }
  static async #cambiarLecturaPrivado(userId, conversationId, messageId) {
    //1. Verificar que la conversacion exista
    const conversation = await PrivateModel.findConversationId(conversationId);
    if(!conversation) throw new Error("No se encontro la conversacion " + conversationId);
    //2. Verificar que el usuario este en la conversación
    const userInConversation = await PrivateModel.isUserConversation(userId, conversationId);
    if(!userInConversation) throw new Error("El usuario no pertenece a esa convesación")
    //3. Cambiar Lectura
    const result = await chatReadModel.setPrivateRead(userId, conversationId, messageId);
    if(!result) throw new Error("No se pudo cambiar la lectura del chat privado");
    return result
  }
  static async #contarLecturaPrivado(userId, conversationId) {
    //1. Verificar que la conversacion exista
    const conversation = await PrivateModel.findConversationId(conversationId);
    if(!conversation) throw new Error("No se encontro la conversacion " + conversationId);
    //2. Verificar que el usuario este en la conversación
    const userInConversation = await PrivateModel.isUserConversation(userId, conversationId);
    if(!userInConversation) throw new Error("El usuario no pertenece a esa convesación")
    //3. contar los mensajes que faltan ver
    const result = await chatReadModel.countUnReadPrivate(userId, conversationId);
    if(!result) throw new Error("No se pudo contar el chat privado");
    return result
  }
}