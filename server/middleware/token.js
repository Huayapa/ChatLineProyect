import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config/config.js';
export const tokensession = (req, res, next) => {
  const token = req.cookies.access_token;
  req.session = {user:null};
  try {
    const data = jwt.verify(token, SECRET_JWT_KEY) //Extraer los datos con la clave secreta 
    req.session.user = data; // <- {id, username, display_name, online, created_at, last_seen}
  } catch {
  }
  next()
}