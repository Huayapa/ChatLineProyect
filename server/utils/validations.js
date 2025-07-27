export class Validations {
  static check(condition, msg) {
    if(condition) throw new Error(msg);
  }
  static id(id, fieldName = 'ID') {
    this.check(!id || typeof id !== 'string', `El ${fieldName} es requerido`);
  }
  static requiredStr(value, fieldName = 'campo') {
    this.check(!value || typeof value !== 'string', `El ${fieldName} es requerido`);
  }
}

export class UserValidation extends Validations {
  static username(username) {
    this.check(!username || typeof username != 'string', "El usuario es requerido");
    this.check(username.trim().length < 5, "El usuario debe tener almenos 5 caracteres sin espacios");
  }
  static displayname(displayname) {
    this.check(!displayname || typeof displayname != 'string', "El nombre visible es requerido");
    this.check(displayname.trim().length < 5, "El nombre visible debe tener almenos 5 caracteres sin espacios");
  }
  static password(password) {
    this.check(!password || typeof password != 'string',"La contraseña es requerida");
    this.check(password.trim().length <= 7,"La contraseña debe tener mas de 7 caracteres");
  }
  static id(id) {
    super.id(id, "ID de usuario");
  }
}

export class GroupValidation extends Validations {
  static name(namegroup) {
    this.check(!namegroup || typeof namegroup != 'string', "El nombre es requerido");
    this.check(namegroup.length < 5, "El nombre debe tener mas de 5 caracteres");
  }
  static description(descriptgroup) {
    this.check(!descriptgroup || typeof descriptgroup != 'string', "La descripcion es requerida");
    this.check(descriptgroup.length < 5, "La descripcion debe tener mas de 5 caracteres");
  }
  static id(id) {
    super.id(id, "ID del grupo");
  }
}

export class ChatValidator extends Validations {
  static message(msg) {
    this.check(!msg || typeof msg != 'string' || msg.trim() === '', "El mensaje es requerido");
    this.check(msg.length > 400, "El mensaje es muy largo");
  }
  static id(id) {
    super.id(id, "ID del mensaje");
  }
}