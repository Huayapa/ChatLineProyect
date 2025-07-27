import { ChatModel } from "../models/chatModel.js";
import { chatReadModel } from "../models/chatReadModel.js";
import { groupModel } from "../models/groupModel.js";
import { PrivateModel } from "../models/privateModel.js";
import { UserValidation, Validations } from "../utils/validations.js";

export class ChatController {
  static async obtenerListaDeChats(userid) {
    //1. Validar userid
    UserValidation.id(userid);
    
    //2. Obtener los mensajes privados y grupos
    const privados = await ChatModel.getChatPrivates(userid);
    const grupos = await ChatModel.getChatGroups(userid);

    let countPrivados = 0;
    let countGrupos = 0;
    if (privados.rows.length > 0 && privados.rows[0].user_id) {
      countPrivados = await chatReadModel.countUnReadPrivate(userid, privados.rows[0].user_id);
    }
    if (grupos.rows.length > 0 && grupos.rows[0].id) {
      countGrupos = await chatReadModel.countUnReadGroup(userid, grupos.rows[0].id);
    }
    //3. Crear las listas con su id, nombre y el tipo que es "grupal o privado"
    const chatPrivados = Array.isArray(privados.rows) ? privados.rows.map(({user_id, display_name}) => ({
      id: user_id,
      name: display_name,
      type: "privado",
      countLastRead: countPrivados.unread 
    })) : [];

    const chatGrupos = Array.isArray(grupos.rows) ? grupos.rows.map(({id, name}) => ({
      id: id,
      name: name,
      type: "grupo",
      countLastRead: countGrupos.unread
    })) : [];

    //4. Unir en un arreglo solo
    const chats = [...chatPrivados, ...chatGrupos].sort((a, b) => 
      a.name.localeCompare(b.name) // ->Ordenar alfabeticamente respetando acentos y mas
    ); 
    return chats;
  }

  static async obtenerIntegrantesDechat(chatid, type, userid) {
    //1. Validar campos
    Validations.id(chatid, "ID del chat (grupal o privado)");
    Validations.id(userid, "ID del usuario");
    Validations.requiredStr(type);
    //2. Dependiendo del type ir a su controlador
    switch (type) {
      case 'grupo': return this.#obtenerIntegrantesGrupo(chatid, userid);
      case 'privado': return this.#obtenerIntegrantesConversacion(chatid, userid);
      default: throw new Error('El tipo de mensaje no esta soportado')
    }
  }

  static async #obtenerIntegrantesGrupo(groupid, userid) {
    //1. Verificar que el grupo exista
    const isExistedGroup = await groupModel.findGroupById(groupid);
    if(!isExistedGroup) throw new Error("Este grupo no existe"); 
    //2. Validar que el usuario pertenezca al grupo
    const isMember = await groupModel.isMember(groupid ,userid)
    if(!isMember) throw new Error("Usted no esta en este grupo");
    //3. Obtener la lista
    const lista = await ChatModel.getMembersGroup(groupid);
    if(!lista) throw new Error("No se pudo obtener los integrantes del grupo")
    return lista.rows
  }
  static async #obtenerIntegrantesConversacion(conversationId, userid) {
    //1. Verificar que la conversacion exista
    const conversation = await PrivateModel.findConversationId(conversationId)
    if(!conversation) throw new Error("Esta conversacion no existe");
    //2. Validar que el usuario pertenezca al la conversación
    const participa = conversation.user1_id === userid || conversation.user2_id === userid;
    if (!participa) throw new Error("No tienes acceso a esta conversación");
    //3. Obtener la lista
    const lista = await ChatModel.getMembersPrivate(conversationId);
    if(!lista) throw new Error("No se pudo obtener los integrantes de la conversación")
    return lista.rows 
  }

  static async obtenerOtroIntegranteIdConversacion(conversationid, userid) {
    Validations.id(userid, "ID del usuario");
    //2. Verificar que la conversacion exista
    const conversation = await PrivateModel.findConversationId(conversationid)
    if(!conversation) throw new Error("Esta conversacion no existe");
    //2. Validar que el usuario pertenezca al la conversación
    const { user1_id, user2_id } = conversation;
    if (userid !== user1_id && userid !== user2_id) {
      throw new Error("Este usuario no pertenece a la conversación");
    }
    const otroIntegrante = userid === user1_id ? user2_id : user1_id;
    return otroIntegrante
  }
}