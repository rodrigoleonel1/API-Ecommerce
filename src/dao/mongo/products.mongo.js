import productsModel from "./models/products.model.js";

export default class ProductsDao {
    constructor(){
        this.model = productsModel
    }

    getAll = async(query, page, limit, sort, sortBy) =>{
        if(!query){
            let results = await this.model.find()
            return results
        } else{
            let results = await this.model.paginate(query, { page, limit, sort: sortBy, lean: true})
            return results
        }
    }

    getById = async(pid) =>{
        let result = await this.model.findOne({_id: pid})
        return result
    }

    create = async (newProduct) =>{
        const result = await this.model.create(newProduct)
        return result
    }

    update = async (pid, productToUpdate) =>{
        const result = await this.model.findOneAndUpdate({ _id: pid}, productToUpdate)
        return result
    }

    delete = async (pid) =>{
        const result = await this.model.deleteOne({_id: pid})
        return result
    }
    
}