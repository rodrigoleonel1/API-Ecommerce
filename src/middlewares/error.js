import logger from "../logger.js"

export default function handleError(error, res){
    logger.error(error.message)
    if (error.cause){logger.error(error.cause)}
    return res.status(400).json({ status: "error", error: error.name})
}

