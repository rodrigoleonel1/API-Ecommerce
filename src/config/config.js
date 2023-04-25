import dotenv from 'dotenv'

dotenv.config()

export default {
    app: {
        mongoURL: process.env.MONGO_URL,
        adminEmail: process.env.ADMIN_EMAIL,
        adminPassword: process.env.ADMIN_PASSWORD
    }
}