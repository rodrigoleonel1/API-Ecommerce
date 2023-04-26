import ProductsDao from "../dao/productsDao.js";

export default class ProductsService{
    constructor(){
        this.productsDao = new ProductsDao()
    }

    getProducts = async () =>{
        return await this.productsDao.getAll()
    }

    getProductsPaginated = async (query, page, limit, sort, controllerType)=>{
        let sortBy = null
        if(sort === 'desc') sortBy = {price: -1}
        if(sort === 'asc') sortBy = {price: 1}

        let type = ''

        if(controllerType == "api") type = 'api/products'
        if(controllerType == 'view') type = 'products'

        let products = await this.productsDao.getAll(query, page, limit, sort, sortBy)
        products.prevLink = products.hasPrevPage ? `http://localhost:8080/${type}?page=${products.prevPage}&limit=${limit}&sort=${sort}` : ''
        products.nextLink = products.hasNextPage ? `http://localhost:8080/${type}?page=${products.nextPage}&limit=${limit}&sort=${sort}` : ''

        return products
    }

    getProductById = async (pid) => {
        return await this.productsDao.getById(pid)
    }

    createProduct = async(newProduct, res) =>{
        let products = await this.productsDao.getAll()
        if (products.find(e => e.code === newProduct.code)){
            let error = {status: "error", message: 'Product not created'}
            return error
        }
        let productAdded = await this.productsDao.create(newProduct)
        return productAdded
    }

    updateProduct = async(pid, productToUpdate) =>{
        const product = await this.productsDao.update(pid, productToUpdate)
        return product
    }

    deleteProduct = async(pid) =>{
        return await this.productsDao.delete(pid)
    }
}