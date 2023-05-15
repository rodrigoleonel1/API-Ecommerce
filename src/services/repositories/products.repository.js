import Errors from '../errors/enums.js'
import CustomError from '../errors/CustomError.js'
import { generateErrorInfo } from '../errors/info.js'

export default class ProductsRepository{
    constructor(dao){
        this.dao = dao
    }

    getProducts = async () =>{
        return await this.dao.getAll()
    }

    getProductsPaginated = async (query, page, limit, sort, controllerType)=>{
        let sortBy = null
        if(sort === 'desc') sortBy = {price: -1}
        if(sort === 'asc') sortBy = {price: 1}

        let type = ''

        if(controllerType == "api") type = 'api/products'
        if(controllerType == 'view') type = 'products'

        let products = await this.dao.getAll(query, page, limit, sort, sortBy)
        products.prevLink = products.hasPrevPage ? `http://localhost:8080/${type}?page=${products.prevPage}&limit=${limit}&sort=${sort}` : ''
        products.nextLink = products.hasNextPage ? `http://localhost:8080/${type}?page=${products.nextPage}&limit=${limit}&sort=${sort}` : ''

        return products
    }

    getProductById = async (pid) => {
        return await this.dao.getById(pid)
    }

    createProduct = async(newProduct) =>{
        if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.status || !newProduct.stock || !newProduct.category || !newProduct.thumbnail) {
            return CustomError.createError({
                name: "Product creation error",
                cause: generateErrorInfo(newProduct),
                message: "Error trying to create a product",
                code: Errors.INVALID_TYPES_ERROR
            })
        }
        let product = await this.dao.create(newProduct)
        return product
    }

    updateProduct = async(pid, productToUpdate) =>{
        const product = await this.dao.update(pid, productToUpdate)
        return product
    }

    deleteProduct = async(pid) =>{
        return await this.dao.delete(pid)
    }
}