import { db } from "../config/database.js"
export class ChatModel {

  /*
  Obtenemos la lista de usuarios con los que el usuario actual ha tenido conversaciones privadas.
  - Obtenemos el id y el nombre visible de la tabla usuarios
  - La tabla usuario se relaciona con la tabla private_messages para que el id coincida con el id del usuario
  - Para esto verificamos si el usuario es el sender o el receiver
  Si es el sender entonces obtenemos el receiver "ya que es el otro usuario"
  Si no es el sender, significa que ese es el otro usuario
  Con ello decidimos con quien va validar el u.id, si es con el sender o el receiver
  */
  static async getChatPrivates(userid) {
    const result = await db.execute({
      sql: `
      SELECT DISTINCT 
        pc.id AS user_id,
        u.display_name
      FROM private_conversations pc 
      JOIN users u ON u.id = (
        CASE
          WHEN pc.user1_id = :userid THEN pc.user2_id
          ELSE pc.user1_id
        END
      )
      WHERE (
        pc.user1_id = :userid AND pc.visible_user1 = 1 
        OR 
        pc.user2_id = :userid AND pc.visible_user2 = 1 
      )
      `,
      args: {userid} 
    });
    return result;
  }

  static async getChatGroups(userid) {
    const result = await db.execute({
      sql: `
      SELECT  
        g.id AS id,
        g.name AS name
      FROM group_members gm
      JOIN groups g 
      ON gm.group_id = g.id
      WHERE gm.user_id = ?
      `,
      args: [userid]
    });
    return result;
  }

  static async getMembersGroup(groupid) {
    const result = await db.execute({
      sql: `
      SELECT
        u.id,
        u.username,
        u.display_name AS displayname,
        u.online,
        gm.role, -- "Solo grupal"
        gm.joined_at AS joinedat,
        u.last_seen AS lastseen
      FROM group_members gm
      JOIN users u ON u.id = gm.user_id
      WHERE gm.group_id = ?
      `,
      args: [groupid]
    });
    return result;
  }
  
  static async getMembersPrivate(conversationid) {
    const result = await db.execute({
      sql: `
      SELECT
        u.id,
        u.username,
        u.display_name AS displayname,
        u.online,
        pc.created_at AS joinedat,
        u.last_seen AS lastseen
      FROM users u
      JOIN private_conversations pc 
      ON u.id = pc.user1_id OR u.id = pc.user2_id
      WHERE pc.id = ?
      `,
      args: [conversationid]
    })
    return result
  }

  // static async getOtherMemberPrivate(conversationid, userid) {
  //   const result = await db.execute({
  //     sql: `
  //       SELECT
  //         CASE
  //           WHEN user1_id = :userid THEN user2_id
  //           ELSE user1_id
  //         END AS userid
  //       FROM private_conversations
  //       WHERE id = :conversationid AND (user1_id = :userid OR user2_id = :userid)
  //     `,
  //     args: {conversationid,userid}
  //   })
  //   return result.rows[0]?.userid || null;
  // }
}