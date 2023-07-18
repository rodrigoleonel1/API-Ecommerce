## Acerca del proyecto

- Proyecto backend donde se implementa un API e-commerce.

## Descripción

- API para manejar productos.
- API para manejar usuarios.
- API para manejar autenticación (login y uso de JWT)
- API para manejar carrito de compras
- Handlebars como motor de vistas
- MongoDB para persistencia de datos.
- Registro de logs con winston.
- Websockets para la creacion de un chat en tiempo real.
- Documentacion de los endpoints de "products" y "cart" con Swagger en el endpoint "/api/docs"
- Proyecto en capas.
  - routes: capa de rutas
  - controllers: capa de controladores
  - persistence: capa de persistencia con implementación de repository, dto y dao.
  - middlewares: capa de middlewares para manejo de errores, subida de archivos con multer y autenticacion de sesión con passport

## Dependencias 

- @faker-js/faker
- connect-mongo
- cookie-parser
- dotenv
- express
- express-handlebars
- express-session
- install
- jsonwebtoken
- mongoose
- mongoose-paginate-v2
- multer
- nodemailer
- nodemon
- passport
- passport-github2
- passport-jwt
- passport-local
- socket.io
- swagger-jsdoc
- swagger-ui-express
- winston

## Dependencias dev

- chai
- mocha
- supertest

##  Scripts

### `npm run dev`

Inizializa en proyecto con nodemon

### `npm run start`

Inizializa el proyecto con node

