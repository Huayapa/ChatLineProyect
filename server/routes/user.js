import express from 'express';
import jwt from 'jsonwebtoken';
import { userController } from '../controllers/userController.js';
import { SECRET_JWT_KEY, SECRET_REFRESH_KEY } from '../config/config.js';

export const userroutes = express.Router();



userroutes.post('/login',async (req, res) => {
  const {username, password} = req.body;
  try {
    //Traemos el usuario en base a si se logueo
    const user = await userController.loginUsuario({username, password});
    //Creamos el accessToken "CORTO"
    const accessToken = jwt.sign(
      {
        id: user.id, 
        username: user.username,
        display_name: user.display_name,
        created_at: user.created_at,
      }, 
      SECRET_JWT_KEY,
      {expiresIn: '1h'}
    )
    //Creamos el refreshToken "LARGO"
    const refreshToken = jwt.sign(
      {
        id: user.id, 
        username: user.username,
        display_name: user.display_name,
        created_at: user.created_at,
      }, 
      SECRET_REFRESH_KEY,
      {expiresIn: '7d'}
    )
    // Almacenar el refresh token en la bd

    //Enviar las 2 cookies
    res
    .cookie('access_token', accessToken, {
      httpOnly: true, // La cookie solo se accede por el servidor
      secure: process.env.NODE_ENV == "production", //La cookies solo puede acceder en https
      sameSite: "strict", //Solo se puede acceder desde el mismo dominio
      maxAge: 1000*60*60 //Valides de una hora
    })
    .cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 1000*60*60*24*7 // 7 dias
    })
    .send({user})
  } catch (error) {
    res.status(400).send({message: error.message})
  }
});

userroutes.post('/register', async (req, res) => {
  const {username, displayname, password} = req.body;
  try {
    const id = await userController.crearUsuario({username, displayname, password});
    res.send({id})
  } catch (error) {
    res.status(400).send({message: error.message})
  }
});

userroutes.post('/logout', (req, res) => {
  res
  .clearCookie('access_token')
  .clearCookie('refresh_token')
  .redirect("/");
  return true;
});

userroutes.post('/refresh', (req, res) => {

  const token = req.cookies.refresh_token;
  
  if(!token) return res.status(401).send("No tiene refresh token");
  
  try {
    //Obtener los datos del token decodificado
    const decoded = jwt.verify(token, SECRET_REFRESH_KEY);
    // Validar que existe en la base de datos
    //Emitir el nuevo access_token
    const accessToken = jwt.sign(
      {
        id: decoded.id, 
        username: decoded.username,
        display_name: decoded.display_name,
        created_at: decoded.created_at,
      }, 
      SECRET_JWT_KEY,
      {expiresIn: '1h'}
    )
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000*60*60
    }).send({ok: true})
  } catch (err) {
    console.error("Ocurrio un problema", err.message);
    res.status(403).send("Token invalido")
  }
})