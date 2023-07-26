import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY, JWT_COOKIE_NAME } from '../config/credentials.js';

export const generateToken = user => {
    const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h' });
    return token;
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null
}