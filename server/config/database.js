//Leer variables de entorno
import dotenv from 'dotenv'
//crear el Cliente
import {createClient} from '@libsql/client'

dotenv.config();

//Conectamos con la base de datos
export const db = createClient({
  url: "libsql://tidy-white-queen-huayapa.aws-us-east-1.turso.io",
  authToken: process.env.DB_TOKEN
})




//*: CREANDO TABLAS NECESARIAS PARA EL CHAT

// TABLAS PRINCIPALES: USUARIOS - general_messages
await db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    online INTEGER NOT NULL DEFAULT 0 CHECK (online IN (0,1,2)), -- 0 - desconectado; 1 - conectado "online"; 2 - ausente;
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Fecha creada
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP  -- Ult vez activo del usuario
  )
`);
await db.execute(`
  CREATE TABLE IF NOT EXISTS general_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);
/*
TABLA REFERENTES A MENSAJES DE GRUPOS
*/
// Grupos creados
await db.execute(`
  CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    create_by TEXT NOT NULL,
    FOREIGN KEY (create_by) REFERENCES users(id)
  )
`);
// Miembros de grupos
await db.execute(`
  CREATE TABLE IF NOT EXISTS group_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    group_id TEXT,
    user_id TEXT,
    role TEXT DEFAULT 'member', -- 'admin', 'moderator', 'member'
    UNIQUE(group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);
// Personas baneadas del grupo -- Falta implementar
await db.execute(`
  CREATE TABLE IF NOT EXISTS group_bans (
    group_id TEXT,
    user_id TEXT,
    banned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );  
`);
// Mensajes de grupos
await db.execute(`
  CREATE TABLE IF NOT EXISTS group_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    group_id TEXT,
    sender_id TEXT,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  )
`);
// Notificaciones de cada usuario en grupos
await db.execute(`
  CREATE TABLE IF NOT EXISTS group_reads (
    user_id TEXT NOT NULL,
    group_id TEXT NOT NULL,
    last_read_message_id INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
  )
`);
/*
TABLA REFERENTES A MENSAJES DE PRIVADOS
*/
// Conversaciones privadas de usuarios
await db.execute(`
  CREATE TABLE IF NOT EXISTS private_conversations (
    id TEXT PRIMARY KEY, -- UUID
    user1_id TEXT NOT NULL,
    user2_id TEXT NOT NULL,
    visible_user1 INTEGER DEFAULT 0,
    visible_user2 INTEGER DEFAULT 0,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_pair UNIQUE (user1_id, user2_id), --Manejo de error por si hay duplicado
    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  )
`);
// Mensajes de la conversacion privada
await db.execute(`
  CREATE TABLE IF NOT EXISTS private_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES private_conversations(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  )
`);
// Notificaciones de cada usuario en una conversacion privada
await db.execute(`
  CREATE TABLE IF NOT EXISTS private_reads (
    user_id TEXT NOT NULL,
    conversation_id TEXT NOT NULL,
    last_read_message_id INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, conversation_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (conversation_id) REFERENCES private_conversations(id)
  )  
`);