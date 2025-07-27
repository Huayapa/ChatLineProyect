import express from 'express';
import { groupController } from '../controllers/groupController.js';

export const grouproutes = express.Router();


grouproutes.post('/create', async (req, res) => {
  const {name, description} = req.body;
  const {user} = req.session;
  if(!user) return res.status(403).send('El usuario no se encontro');
  try {
    const id = await groupController.crearGrupo({name, description, create_byid: user.id});
    res.send({id});
  } catch (error) {
    res.status(400).send(error.message)
  }
});

grouproutes.post('/joinuser', async (req, res) => {
  const {groupid} = req.body;
  const {user} = req.session;
  if(!user) return res.status(403).send('El usuario no se encontro');
  try {
    const isSuccess = await groupController.agregarUsuario({groupid:groupid, userid: user.id});
    res.send({isSuccess});
  } catch (err) {
    res.status(400).send({error: err.message});
  }
});

grouproutes.get('/mostrar', async (req, res) => {
  try {
    const result = await groupController.mostrarGrupos();
    res.send(result)
  } catch (err) {
    res.status(400).send(err.message)
  }
})