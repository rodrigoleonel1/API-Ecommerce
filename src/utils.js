import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import jwt from 'jsonwebtoken'
import { JWT_COOKIE_NAME, JWT_PRIVATE_KEY } from './config/credentials.js'
import passport from 'passport'

export default __dirname

import bcrypt from 'bcrypt'

export const createHash = (password) =>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) =>{
    return bcrypt.compareSync(password, user.password)
}

//jwt

export const generateToken = user =>{
    const token = jwt.sign({user}, JWT_PRIVATE_KEY, {expiresIn: '24h'})
    return token
}

export const extractCookie = req =>{
    return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null
}

//passport

export const passportCall = (strategy) =>{
    return async (req, res, next) =>{
        passport.authenticate(strategy, function(err, user, info){
            if(err) return next(err)
            if(!user) return res.status(401).render('errors/base', { error: info.messages? info.messages : info.toString()})
            req.user = user
            next()
        })(req, res, next)
    }
}