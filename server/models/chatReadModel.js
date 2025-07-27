import { db } from "../config/database.js";

export class chatReadModel {
  // * GROUP READ
  static async createGroupRead(userId, groupId, messageId) {
    const result = await tx.execute({
      sql: `
      INSERT INTO group_reads(user_id, group_id, last_read_message_id) 
      VALUES (?, ?, ?)
      `,
      args: [userId, groupId, messageId]
    })
    if (!result || result.rowsAffected === 0) {
      throw new Error('No se pudo crear el registro de lectura del grupo');
    }
    return result;
  }
  static async getGroupRead(userId, groupId) {
    const result = await db.execute({
      sql: `
      SELECT 
        user_id AS userid,
        group_id AS chatid,
        last_read_message_id AS lastmessageid
      FROM group_reads 
      WHERE user_id = ? AND group_id = ?
      `,
      args: [userId, groupId]
    })
    return result.rows;
  }
  static async setGroupRead(userId, groupId, messageId) {
    const result = await db.execute({
      sql: `
      UPDATE group_reads
      SET last_read_message_id = ?
      WHERE user_id = ? AND group_id = ?
      `,
      args: [messageId, userId, groupId]
    })
    return result;
  }
  static async countUnReadGroup(userId, groupId) {
    const result = await db.execute({
      sql: `
        SELECT 
          COUNT(*) AS unread
        FROM group_messages
        WHERE group_id = ? 
        AND id > (
          SELECT
            last_read_message_id
          FROM group_reads
          WHERE user_id = ? AND group_id = ?
        )
      `,
      args: [groupId, userId, groupId]
    });
    return result.rows[0] || null
  }
  // * PRIVATE READ
  static async createPrivateRead(userId, conversationId, messageId) {
    const result = await tx.execute({
      sql: `
      INSERT INTO private_reads (user_id, conversation_id, last_read_message_id) 
      VALUES (?, ?, ?)
      `,
      args: [userId, conversationId, messageId]
    })
    return result;
  }
  static async getPrivateRead(userId, conversationId) {
    const result = await db.execute({
      sql: `
      SELECT 
        user_id AS userid,
        conversation_id AS chatid,
        last_read_message_id AS lastmessageid
      FROM private_reads 
      WHERE user_id = ? AND conversation_id = ?
      `,
      args: [userId, conversationId]
    })
    return result;
  }
  static async setPrivateRead(userId, conversationId, messageId) {
    const result = await db.execute({
      sql: `
      UPDATE private_reads
      SET last_read_message_id = ?
      WHERE user_id = ? AND conversation_id = ?
      `,
      args: [messageId, userId, conversationId]
    })
    return result;
  }
  static async countUnReadPrivate(userId, conversationId) {
    const result = await db.execute({
      sql: `
        SELECT 
          COUNT(*) AS unread
        FROM private_messages
        WHERE conversation_id = ? 
        AND id > (
          SELECT
            last_read_message_id
          FROM private_reads
          WHERE user_id = ? AND conversation_id = ?
        )
      `,
      args: [conversationId, userId, conversationId]
    });
    return result.rows[0] || null
  }
}