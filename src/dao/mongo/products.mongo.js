import productsModel from './models/products.model.js';
import CustomError from '../../services/errors/CustomError.js';
import EErros from '../../services/errors/enums.js';
import { userService } from '../../services/index.repository.js';

export default class ProductsMongo {
    constructor() {
        this.model = productsModel;
    }

    getAll = async (params) => {
        if (!params) return await this.model.find();

        const { limit = 10, page = 1, controller, sort } = params;

        let price;
        if (sort === 'desc') price = { price: -1 };
        if (sort === 'asc') price = { price: 1 };

        let type;
        if (controller == "api") type = 'api/products';
        if (controller == 'view') type = 'products';

        let query = {};
        if (params.category) query = { category: params.category };

        let products = await this.model.paginate(query, { page, limit, sort: price, lean: true });
        products.prevLink = products.hasPrevPage ? `http://localhost:8080/${type}?page=${products.prevPage}&limit=${limit}&sort=${sort}` : ''
        products.nextLink = products.hasNextPage ? `http://localhost:8080/${type}?page=${products.nextPage}&limit=${limit}&sort=${sort}` : ''

        if (products.docs.length === 0) {
            CustomError.createError({
                name: "Bad Request",
                message: "There are no products available to display",
                code: EErros.BAD_REQUEST
            })
        }

        return products;
    }

    getById = async (pid) => {
        const product = await this.model.findOne({ _id: pid }).lean();
        if (!product) {
            CustomError.createError({
                name: "Reference error",
                message: "There is no product with that id",
                code: EErros.BAD_REQUEST
            })
        }

        return product;
    }

    create = async (newProduct) => {
        const { title, description, code, price, status, stock, category, thumbnail } = newProduct
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
            CustomError.createError({
                name: "Conflict trying to create the product",
                message: "One or more properties are incomplete or invalid",
                code: EErros.CONFLICT
            })
        }
        const duplicateCode = await this.model.findOne({ code: code });
        if (code == duplicateCode?.code) {
            CustomError.createError({
                name: "Duplicate code error",
                message: "The 'code' you are trying to use is already in use and cannot be repeated",
                code: EErros.CONFLICT
            })
        }

        return await this.model.create(newProduct);
    }

    update = async (pid, productToUpdate) => {
        const product = await this.model.findOne({ _id: pid });
        if (!product) {
            CustomError.createError({
                name: "Reference error",
                message: "There is no product with that id",
                code: EErros.BAD_REQUEST
            })
        }
        const productToUpdateKeys = Object.keys(productToUpdate);
        const productsProperties = ["title", "description", "price", "status", "stock", "category", "thumbnail"];
        productToUpdateKeys.forEach(key => {
            const found = productsProperties.find(propertie => propertie == key);
            if (!found) {
                CustomError.createError({
                    name: "Reference error",
                    message: "One or more properties are invalid",
                    code: EErros.BAD_REQUEST
                })
            }
        });

        return await this.model.findOneAndUpdate({ _id: pid }, productToUpdate, { new: true });
    }

    delete = async (pid, user) => {
        const product = await this.model.findOne({ _id: pid }).lean()
        if (user.role == 'premium' && product.owner != user._id) {
            CustomError.createError({
                name: "Unauthorized",
                message: "You do not have the necessary permissions to do this.",
                code: EErros.UNAUTHORIZED
            })
        }
        const productDeleted = await this.model.deleteOne({ _id: pid });
        if (productDeleted.deletedCount === 0) {
            CustomError.createError({
                name: "Reference error",
                message: "There is no product with that id",
                code: EErros.BAD_REQUEST
            })
        }
        if (product.owner !== 'admin') {
            const owner = await userService.getById({ _id: product.owner })
            if (owner.role == 'premium') {
                const html = `<h1>Tu producto ha sido eliminado</h1><br>
                <p>Hola ${owner.first_name}, nos comunicamos contigo para informarte que tu producto "${product.title}" con el código ${product.code} ha sido eliminado.<p>`
                await userService.sendMail(owner.email, 'Eliminación de producto', html)
            }
        }
        return productDeleted
    }
}