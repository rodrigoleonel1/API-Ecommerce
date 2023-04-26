import ProductsService from "../../services/productsServices.js"
const productService = new ProductsService()

const getProductsView = async (req, res) =>{
    try {
        const limit = req.query?.limit || 10
        const page = req.query?.page || 1
        let sort = req.query.sort
        let query = {}
        if(req.query.category || req.query.status) query = req.query
        let controllerType = 'view'
        let products = await productService.getProductsPaginated(query, page, limit, sort, controllerType)
        const user = req.user.user
    
        if(products.totalDocs === 0){
            res.render('errors/base', { error: 'Not products found' })
        } else {
            res.render('products', { products, user, title: 'Productos'} )
        }
    } catch (error) {
        res.render('errors/base', { error: 'No se pudo cargar los productos debido a un error.'})
    }
}

export { getProductsView } 