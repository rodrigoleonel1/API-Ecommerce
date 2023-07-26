import passport from 'passport';
import passport_jwt from 'passport-jwt';
import local from 'passport-local';
import GithubStrategy from 'passport-github2';
import config from './config.js';
import userModel from '../dao/mongo/models/user.model.js';
import cartModel from '../dao/mongo/models/cart.model.js';
import { JWT_PRIVATE_KEY } from './credentials.js';
import { createHash, isValidPassword } from '../helpers/bcrypt.js';
import { generateToken, extractCookie } from '../helpers/jwt.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = passport_jwt.Strategy;
const ExtractJWT = passport_jwt.ExtractJwt;

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, email, age } = req.body;
            const user = await userModel.findOne({ email: username });
            if (user) return done(null, false);
            const cart = await cartModel.create({});
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: cart._id,
                last_connection: Date.now(),
                documents: {
                    profile_pic: {
                        status: false,
                        name: '',
                        reference: ''
                    },
                    identification: {
                        status: false,
                        name: '',
                        reference: ''
                    },
                    domicile: {
                        status: false,
                        name: '',
                        reference: ''
                    },
                    acc_status: {
                        status: false,
                        name: '',
                        reference: ''
                    }
                }
            }
            if (newUser.email == config.ADMIN_EMAIL && isValidPassword(newUser, config.ADMIN_PASSWORD)) newUser.role = 'admin';
            const result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (!user) return done(null, user);
            if (!isValidPassword(user, password)) return done(null, false);
            user.last_connection = Date.now();
            await userModel.findOneAndUpdate({ email: username }, user);
            const token = generateToken(user);
            user.token = token;
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.9468a729ceb7ea8a',
        clientSecret: 'a3670cd52972d3e520932db97b273d3eeca6448d',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ email: profile._json.email });
            console.log(profile)
            if (user) {
                const token = generateToken(user);
                user.token = token;
                user.last_connection = Date.now();
                return done(null, user);
            }
            const cart = await cartModel.create({});
            const newUser = await userModel.create({
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                age: undefined,
                password: "",
                cart: cart._id,
                last_connection: Date.now()
            })
            const userCreated = await userModel.findOne({ email: newUser.email });
            const token = generateToken(userCreated);
            userCreated.token = token;
            return done(null, userCreated);
        } catch (error) {
            console.log(error)
            return done(error);
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY
    }, async (jwt_payload, done) => {
        done(null, jwt_payload);
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    })
}

export default initializePassport;