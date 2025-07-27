import { groupModel } from "../models/groupModel.js";
import { usersModel } from "../models/usersModel.js";
import { GroupValidation, UserValidation } from "../utils/validations.js";

export class groupController {
  static async crearGrupo ({name, description, create_byid}) {
    // 1. Validar campos -> name, description, createbyid "Id de la persona"
    GroupValidation.name(name);
    GroupValidation.description(description);
    UserValidation.id(create_byid);
    // 2. Verificar que el id del creador exista
    const user = await usersModel.findUserById(create_byid);
    if (!user) throw new Error("El usuario no se ha encontrado");
    // 3. Crear id
    const id = crypto.randomUUID();
    // 4. Crear grupo
    const result = await groupModel.createGroup(id, name, description, create_byid);
    if (!result) throw new Error("No se pudo crear el grupo o ya esta creado");
    return result;
  }

  static async mostrarGrupos() {
    const result = await groupModel.getGroups();
    if(!result) throw new Error("Ocurrio un problema al obtener los grupos.")
    return result;
  }

  static async agregarUsuario({groupid,userid}) {
    // 1. Validar campos -> groupid - userid
    GroupValidation.id(groupid);
    UserValidation.id(userid);
    // 2. Verificar que los id existan en la base de datos
    const user = await usersModel.findUserById(userid);
    if(!user) throw new Error("El usuario no fue encontrado");
    const group = await groupModel.findGroupById(groupid);
    if(!group) throw new Error("El grupo no se encontro");
    // 3. Verificar que el usuario no este en el grupo
    const usergroup = await groupModel.isMember(groupid,userid);
    if(usergroup) throw new Error("El usuario ya esta inscrito");
    // 4. Añadir usuario a el grupo
    const result = await groupModel.addMemberGroup(groupid, userid);
    if(!result) throw new Error("No se pudo añadir el usuario al grupo");
    return result
  }
}