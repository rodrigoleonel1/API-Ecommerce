import CartsDao from "../dao/mongo/carts.mongo.js";
import CartsRepository from "./repositories/carts.repository.js";
import ProductsRepository from "./repositories/products.repository.js";
import ProductsDao from '../dao/mongo/products.mongo.js'
import UsersRepository from "./repositories/users.repository.js";
import UsersDao from "../dao/mongo/users.dao.js";

const cartService = new CartsRepository(new CartsDao)
const productService = new ProductsRepository(new ProductsDao)
const userService = new UsersRepository(new UsersDao)

export { cartService, productService, userService }