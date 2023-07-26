import { generateProducts } from '../helpers/faker.js';
import GenericRepository from './generic.repository.js';

export default class ProductsRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    generateMock = () => {
        const products = [];
        for (let i = 0; i < 100; i++) products.push(generateProducts());
        return products;
    }
}