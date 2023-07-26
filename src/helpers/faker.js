import { fakerES as faker } from '@faker-js/faker';

export const generateProducts = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(6),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.string.numeric(2),
        category: faker.commerce.productMaterial(),
        thumbnail: faker.image.url()
    }
}