import userModel from "./models/user.model.js"

export default class UsersDao {
    constructor(){
        this.model = userModel
    }

    getById = async(uid) =>{
        let result = await this.model.findOne({_id: uid}).populate('cart')
        return result
    }
}