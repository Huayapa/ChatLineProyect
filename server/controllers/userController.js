import { SALT_ROUNDS } from "../config/config.js";
import { usersModel } from "../models/usersModel.js";
import bcrypt from "bcrypt";
import { UserValidation, Validations } from "../utils/validations.js";

export class userController {
  static async crearUsuario ({username, displayname, password}) {
    // 1. Validar los campos solicitados -> username - password - displayname
    UserValidation.username(username);
    UserValidation.displayname(displayname);
    UserValidation.password(password);
    
    // 2. Verificar que el usuario y el nombre visible no existe
    const user = await usersModel.getUserNameExisted(username);
    if(user) throw new Error("El usuario ya existe");
    const displayuser = await usersModel.getUserDisplayNameExisted(username);
    if(displayuser) throw new Error( "El nombre visible ya existe");
    // 3. Crear id
    const id = crypto.randomUUID();
    // 3. Hashear contraseña
    const hashpassword = await bcrypt.hash(password, SALT_ROUNDS);
    // 4. Enviar datos para crear
    const result = await usersModel.createUser(id, username, displayname, hashpassword);
    if(result) throw new Error( "No se pudo crear el usuario")
    return id;
  }
  static async loginUsuario ({username, password}) {
    // 1. Validar los campos solicitados -> username - password
    UserValidation.username(username);
    UserValidation.password(password);
    // 2. Verificar que el usuario exista
    const user = await usersModel.getUserNameExisted(username);
    if(!user) throw new Error("El usuario no existe");
    // 3. Validar contraseña
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) throw new Error("Contraseña incorrecta");
    // 4. Devolver solo parametros relevantes 
    // const {password: _, ...publicuser} = user; // <- Quitamos el password 
    return {
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      online: user.online,
      created_at: user.created_at,
      last_seen: user.last_seen
    };
  }

  static async cambiarEstadoUsuario(userid, type) {
    //1. Validar los campos
    UserValidation.id(userid);
    Validations.requiredStr(type);
    //2. Aplicar estado dependiendo del tipo
    switch (type) {
      case 'online': return this.#onlineUsuario(userid);
      case 'ausente': return this.#ausenteUsuario(userid);
      case 'desconectado': return this.#desconectarUsuario(userid);
      default: throw new Error('El tipo de estado no esta soportado.')
    }
  }

  static async #onlineUsuario (userid) {
    const isValid = await usersModel.onlineUser(userid);
    if(!isValid) {
      throw new Error ("No se pudo cambiar el estado del usuario a online");
    }
    return isValid
  }
  static async #desconectarUsuario (userid) {
    const isValid = await usersModel.disconectUser(userid);
    if(!isValid) throw new Error ("No se pudo cambiar el estado del usuario a desconectado");
    return isValid
  }
  static async #ausenteUsuario (userid) {
    const isValid = await usersModel.awayUser(userid);
    if(!isValid) throw new Error ("No se pudo cambiar el estado del usuario a ausente");
    return isValid
  }
}

