import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const generateToken = (userId,email,role,rememberMe) => {
  return jwt.sign({ userId,email,role,rememberMe }, process.env.SECRET_CODE, {
    expiresIn: rememberMe ? '30d' : '1d' // Token valid for 30 days if rememberMe, else 1 day
  });
};

export default generateToken;