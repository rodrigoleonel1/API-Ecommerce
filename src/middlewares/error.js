import Errors from "../services/errors/enums.js";

export default function handleError(error, res){
    if (error.cause){console.log(error.cause)}
    console.log(error.message)
    return res.status(400).json({ status: "error", error: error.name})
}

