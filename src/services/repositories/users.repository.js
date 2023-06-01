import Mail from "../../helpers/mail.js"
export default class UsersRepository{
    constructor(dao){
        this.dao = dao
        this.mail= new Mail()
    }

    getUser = async(req) =>{
        try {
            const uid = req.user._id
            let user = await this.dao.getById(uid)
            return user
        } catch (error) {
            console.log(error)
        }
    }

    sendMail = async(user, subject, html) =>{
        const result = this.mail.send(user, subject, html)
        return result
    }
}
