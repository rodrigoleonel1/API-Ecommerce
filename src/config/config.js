import dotenv from 'dotenv'

dotenv.config()
export default {
    MONGO_URL: process.env.MONGO_URL,
    PERSISTENCE: process.env.PERSISTENCE,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    PERSISTENCE: process.env.PERSISTENCE,
    ENVIRONMENT: process.env.ENVIRONMENT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS
}