import express from 'express';
import { ChatController } from '../controllers/chatController.js';

export const chatRoutes = express.Router();

chatRoutes.get("/getchats", async (req, res) => {
  const {user} = req.session;
  
  if(!user) return res.status(403).send('El usuario no se encontro');
  try {
    const chats = await ChatController.obtenerListaDeChats(user.id);
    res.status(200).send({chats});
  } catch (error) {
    res.status(400).send(error.message);
  }
})