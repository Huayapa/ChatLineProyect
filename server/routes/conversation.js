import express from 'express';
import { privateController } from '../controllers/privateController.js';

export const chatPrivateRoutes = express.Router();

chatPrivateRoutes.post("/create", async (req, res) => {
  const {userid} = req.body;
  const {user} = req.session;
  if(!user) return res.status(403).send('El usuario no se encontro');
  try {
    const id = await privateController.crearChatPrivado(user.id, userid, user.id);
    res.status(200).send({id});
  } catch (error) {
    res.status(400).send(error.message);
  }
}) 