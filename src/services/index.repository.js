import CartsRepository from '../repository/carts.repository.js';
import CartsMongo from '../dao/mongo/carts.mongo.js';
import ProductsRepository from '../repository/products.repository.js';
import ProductsMongo from '../dao/mongo/products.mongo.js';
import UsersRepository from '../repository/users.repository.js';
import UsersMongo from '../dao/mongo/users.mongo.js';
import MessagesRepository from '../repository/messages.repository.js';
import MessagesMongo from '../dao/mongo/messages.mongo.js';

export const userService = new UsersRepository(new UsersMongo);
export const cartService = new CartsRepository(new CartsMongo);
export const productService = new ProductsRepository(new ProductsMongo);
export const messageService = new MessagesRepository(new MessagesMongo);



