export default class UsersRepository{
    constructor(dao){
        this.dao = dao
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
}
