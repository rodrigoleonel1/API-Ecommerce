import mongoose from "mongoose" 

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: {
        type: String,
        default: 'user'
    },
    cart: [{type: mongoose.Schema.Types.ObjectId, ref: 'carts'}]
})

mongoose.set("strictQuery", false)
const userModel = mongoose.model(userCollection, userSchema)

export default userModel