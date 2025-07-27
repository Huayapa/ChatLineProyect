import express from 'express';
import { userroutes } from './user.js';
import { grouproutes } from './group.js';
import { chatRoutes } from './chat.js';
import { chatPrivateRoutes } from './conversation.js';
import dotenv from 'dotenv'

export const indexroutes = express.Router();

dotenv.config();
// RUTAS DE LA PAGINA
indexroutes.get("/",(req, res) => {
  const {user} = req.session;
  res.render('login', {user:user || null, page: "login"})
})

indexroutes.get("/register",(req, res) => {
  const {user} = req.session;
  res.render('register', {user:user || null, page: "register"})
})

indexroutes.get('/chat', (req, res) => {
  const {user} = req.session;
  res.render('index', {user:user || null, page: "chat", socketUrl: process.env.SOCKET_URL || "http://localhost:3000"})
});

// RUTAS DE USUARIO
indexroutes.use('/user', userroutes);
// RUTAS DE GRUPO
indexroutes.use('/group', grouproutes);
// RUTAS DE CHATS
indexroutes.use('/chats', chatRoutes);
// RUTAS DE CONVERSACION 
indexroutes.use('/conversation', chatPrivateRoutes);