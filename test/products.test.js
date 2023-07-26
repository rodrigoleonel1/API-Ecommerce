import chai from 'chai';
import supertest from 'supertest';
import { fakerES as faker } from '@faker-js/faker';

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing Products Module', () => {
    describe('Test POST and PUT endpoints', () => {
        it('El endpoint POST/api/products debe crear un producto y el endpoint PUT/api/products/:pid debe actualizarlo', async () => {
            const productMock = {
                title: "Product",
                description: "Product desciption",
                code: faker.string.alphanumeric(6),
                price: 10.999,
                status: true,
                stock: 10,
                category: "category",
                thumbnail: "image.jpg"
            }
            const responsePOST = await requester.post('/api/products').send(productMock)
            expect(responsePOST._body.payload).to.have.property('_id')

            const productUpdateMock = {
                title: "Product Update",
                description: "Product description update",
                price: 99.999,
                status: true,
                stock: 20,
                category: "category",
                thumbnail: "imageUpdate.jpg"
            }
            const responsePUT = await requester.put(`/api/products/${responsePOST._body.payload._id}`).send(productUpdateMock)
            expect(responsePUT._body.status).to.be.equal('success')
        })
    })

    describe('Test GET endpoints', () => {
        it('El endpoint GET /api/products debe obetener todos los productos', async () => {
            const response = await requester.get('/api/products')
            expect(response.statusCode).to.be.equal(200)
        })

        it('El endpoint GET /api/products/:pid debe obtener un producto por id', async () => {
            const response = await requester.get('/api/products/641f930dec14bb9f84b578a5')
            expect(response.statusCode).to.be.equal(200)
        })
    })
})