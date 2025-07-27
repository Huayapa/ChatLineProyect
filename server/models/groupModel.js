import { db } from "../config/database.js";

export class groupModel {
  static async createGroup(idgroup, name, description, create_byid) {
    try {
      await db.batch([
        {
          sql: 'INSERT INTO groups (id, name, description, create_by) VALUES (?, ?, ?, ?)',
          args: [idgroup, name, description, create_byid]
        },
        {
          sql: 'INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)',
          args: [idgroup,create_byid, 'admin']
        },
        {
          sql: `
          INSERT INTO group_reads(user_id, group_id, last_read_message_id) 
          VALUES (?, ?, ?)
          `,
          args: [create_byid, idgroup, 0]
        }
      ])
      return true;
    } catch (err) {
      console.error('Error al crear grupo:', err.message);
      return false;
    }
  }
  static async addMemberGroup(groupid, userid) {
    try {
      await db.batch([
        {
          sql: 'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)',
          args: [groupid, userid]
        },
        {
          sql: `
          INSERT INTO group_reads(user_id, group_id, last_read_message_id) 
          VALUES (?, ?, ?)
          `,
          args: [userid, groupid, 0]
        }
      ])
      return true;
    } catch (err) {
      throw new Error("No se pudo añadir el usuario al grupo.")
    }
  }
  static async isMember(groupid, userid) {
    const result = await db.execute({
      sql: 'SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ? LIMIT 1',
      args: [groupid, userid]
    });
    return result.rows.length > 0;
  }
  static async getGroups() {
    const result = await db.execute({
      sql: `
      SELECT g.id, g.name, g.description, g.create_at, u.display_name
      FROM groups g
      LEFT JOIN users u
      WHERE g.create_by = u.id
      `
    });
    return result.rows
  }
  static async findGroupById(groupid) {
    const result = await db.execute({
      sql: 'SELECT id, name FROM groups WHERE id = ?',
      args: [groupid]
    });
    return result.rows[0] || null;
  }
}