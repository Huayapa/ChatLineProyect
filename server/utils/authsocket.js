import { SECRET_JWT_KEY } from "../config/config.js";
import jwt from 'jsonwebtoken';
import cookie from 'cookie';


export function getUserCookieSocket(socket) {
  const cookies = cookie.parse(socket.request.headers.cookie || '');
  const token = cookies.access_token;
  if(!token) return null;
  try {
    const user = jwt.verify(token, SECRET_JWT_KEY);
    return user
  } catch (err) {
    console.error('Token inválido en socket:', err.message);
    return null;
  }
}