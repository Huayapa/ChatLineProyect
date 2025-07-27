import { db } from "../config/database.js"

// * En este modelo usamos turso sql
export class messagesModel {
  static async createMessagesGroup(groupid, msg, senderid) {
    const result = await db.execute({
      sql:`
      INSERT INTO group_messages (content, group_id, sender_id)
      VALUES (:msg, :groupid, :senderid) 
      RETURNING *, group_id AS chatid;
      `,
      args: {groupid, msg, senderid}
    });
    return result.rows[0];
  }
  
  static async createMessagesPrivate(toPrivateId, msg, senderid) {
    const result = await db.execute({
      sql:`
      INSERT INTO private_messages (conversation_id, sender_id, content)
      VALUES (:toPrivateId, :senderid, :msg) 
      RETURNING *, conversation_id AS chatid;
      `,
      args: {toPrivateId, msg, senderid}
    });
    return result.rows[0];
  }

  static async getMessagesGroup(groupid, offsetId = 0) {
    const results = await db.execute({
      sql: `
      SELECT 
        gm.id AS messageid,
        u.id AS userid,
        gm.content,
        u.display_name,
        gm.timestamp,
        u.online
      FROM group_messages gm 
      LEFT JOIN users u
      ON gm.sender_id = u.id
      WHERE gm.group_id = ?
      AND gm.id > ?
      ORDER BY gm.id ASC
      `,
      args: [groupid, offsetId]
    });
    return results.rows;
  }

  static async getMessagePrivate(conversationId, offsetId = 0) {
    const results = await db.execute({
      sql: `
      SELECT 
        pm.id AS messageid,
        u.id AS userid,
        u.display_name,
        pm.content,
        pm.sent_at,
        u.online
      FROM private_messages pm
      LEFT JOIN users u
      ON pm.sender_id = u.id
      WHERE pm.conversation_id = ?
      AND pm.id > ?
      ORDER BY pm.id ASC
      `,
      args: [conversationId, offsetId]
    });
    return results.rows;
  }
}
