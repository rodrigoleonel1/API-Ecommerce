export const generateErrorInfo = ( product ) => {
    return `
    One or more properties were incomplete or not valid.
    List of required properties:
        - title: Must be a string. Received (${product.title}) 
        - description: Must be a string. Received (${product.description})
        - code: Must be a string. Received (${product.code})
        - price: Must be a number. Received (${product.price})
        - status: Must be a boolean. Received (${product.status})
        - stock: Must be a number. Received (${product.stock})
        - category: Must be a string. Received (${product.category})
        - thumbnail: Must be a string. Received (${product.thumbnail})
    `
}
