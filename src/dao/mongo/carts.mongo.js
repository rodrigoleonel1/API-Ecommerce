import cartModel from "./models/cart.model.js"

export default class CartsDao {
    constructor(){
        this.model = cartModel
    }

    getAll = async() =>{
        let results = await this.model.find()
        return results

    }

    getByIdPopulate = async(cid) =>{
        let result = await this.model.find({_id: cid})
        return result
    }

    getById = async(cid) =>{
        let result = await this.model.findOne({_id: cid}).lean().exec()
        return result
    }

    create = async () =>{
        const result = await this.model.create({})
        return result
    }

    update = async (cid, cartToUpdate) =>{
        const result = await this.model.updateOne({ _id: cid}, cartToUpdate)
        await cartModel.updateOne({ _id: cid}, cartToUpdate)
        return result
    }

    delete = async (cid) =>{
        const result = await this.model.deleteOne({_id: cid})
        return result
    } 
}