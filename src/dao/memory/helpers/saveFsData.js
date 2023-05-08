import fs from 'fs'

const saveFsData = async ( model, path ) =>{
    let data = await model.find().lean().exec()
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

const productsPath = './src/dao/fs/data/products.json'
const cartsPath = './src/dao/fs/data/carrito.json'

export { saveFsData, productsPath, cartsPath }