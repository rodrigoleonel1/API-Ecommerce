import { JWT_COOKIE_NAME } from '../config/credentials.js';
import UserDTO from '../dao/dto/user.dto.js';

// POST/api/sessions/register
const createRegister = async (req, res) => {
    res.redirect('/login');
}

// POST/api/sessions/login
const createLogin = async (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ status: 'error', error: 'Invalid credentiales' })
        res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products');
    } catch (error) {
        next(error);
    }
}

// POST/api/sessions/githubcallback
const createLoginGithub = async (req, res) => {
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
}

// GET/api/sessions/logout
const closeSession = (req, res) => {
    res.clearCookie(JWT_COOKIE_NAME).redirect('/login');
}

// GET/api/sessions/current
const currentSession = (req, res, next) => {
    try {
        if (!req.user) return res.status(400).json({ status: "error", message: "No user logged in" })
        const { _id, first_name, last_name, email, role, documents } = req.user
        const user = new UserDTO({ _id, first_name, last_name, email, role, documents })
        res.status(200).json({ status: "success", payload: user });
    } catch (error) {
        next(error);
    }
}

export default {
    createRegister,
    createLogin,
    createLoginGithub,
    closeSession,
    currentSession,
} 