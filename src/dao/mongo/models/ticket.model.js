import mongoose from "mongoose";

const ticketCollection = "ticket"

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
})

mongoose.set("strictQuery", false)
const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export default ticketModel