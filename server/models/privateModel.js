import { db } from "../config/database.js";

export class PrivateModel {
  static async findConversationId(privateid) {
    const result = await db.execute({
      sql: 'SELECT user1_id, user2_id, created_by FROM private_conversations WHERE id = ?',
      args: [privateid]
    })
    return result.rows[0] ?? null;
  }

  static async createConversation(idconversation,userid1, userid2, createbyid) {
    try {
      // Determinar qué campo visible activar
      const visible_user1 = userid1 === createbyid ? 1 : 0;
      const visible_user2 = userid2 === createbyid ? 1 : 0;
      await db.batch([
        {
          sql: `INSERT INTO private_conversations (id, user1_id, user2_id, created_by, visible_user1, visible_user2) VALUES (?, ?, ?, ?, ?, ?)`,
          args: [idconversation, userid1, userid2, createbyid, visible_user1, visible_user2]
        },
        {
          sql: `
          INSERT INTO private_reads (user_id, conversation_id, last_read_message_id) 
          VALUES (?, ?, ?)
          `,
          args: [userid1, idconversation, 0]
        },
        {
          sql: `
          INSERT INTO private_reads (user_id, conversation_id, last_read_message_id) 
          VALUES (?, ?, ?)
          `,
          args: [userid2, idconversation, 0]
        }
      ]);
      return true
    } catch (err) {
      console.error('Error al crear la conversacion:', err.message);
      return false
    }
  }

  static async findCreateConversationWithIds(userid1, userid2) {
    const result = await db.execute({
      sql: `SELECT * FROM private_conversations WHERE user1_id = ? AND user2_id = ?`,
      args: [userid1, userid2]
    })
    return result
  }

  static async isUserConversation(userid, conversationid) {
    const result = await db.execute({
      sql: `
      SELECT 1 FROM private_conversations 
      WHERE id = ? AND (
        user1_id = ? OR user2_id = ?
      ) LIMIT 1
      `,
      args: [conversationid, userid, userid]
    });
    return result.rows.length > 0;
  }

  static async updateVisibility(conversationId, column) {
    const result = await db.execute({
      sql: `UPDATE private_conversations SET ${column} = 1 WHERE id = ?`,
      args: [conversationId]
    });
    return result
  }

}