import { db } from "../config/database.js"

export class usersModel {
  static async getUserNameExisted(username) {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: [username]
    });
    return result.rows[0];
  }
  static async getUserDisplayNameExisted(display_name) {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE display_name = ?',
      args: [display_name]
    });
    return result.rows[0];
  }
  static async createUser(id, username, displayname, password) {
    const result = await db.execute({
      sql: 'INSERT INTO users (id, username, display_name, password) VALUES (?, ?, ?, ?)',
      args: [id, username, displayname, password]
    })
    return result.rowsAffected !== 1;
  }
  static async findUserById(iduser) {
    const result = await db.execute({
      sql: 'SELECT id, username FROM users WHERE id = ?',
      args: [iduser]
    });
    return result.rows[0];
  }
  // ESTADOS
  static async onlineUser(userid) {
    const result = await db.execute({
      sql: 'UPDATE users SET online = 1 WHERE id = :userid',
      args: {userid}
    })
    return result.rowsAffected;
  }
  static async disconectUser(userid) {
    const result = await db.execute({
      sql: 'UPDATE users SET online = 0, last_seen = CURRENT_TIMESTAMP WHERE id = :userid',
      args: {userid}
    })
    return result.rowsAffected;
  }
  static async awayUser(userid) {
    const result = await db.execute({
      sql: 'UPDATE users SET online = 2 WHERE id = :userid',
      args: {userid}
    })
    return result.rowsAffected;
  }
}
