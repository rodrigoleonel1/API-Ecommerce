import EErros from "../services/errors/enums.js";
import logger from "../helpers/logger.js";

export default (error, req, res, next) => {
    logger.error(error.message);
    if (error.name == "CastError") {
        error.code = EErros.BAD_REQUEST;
        error.message = "The id is not valid";
    }
    switch (error.code) {
        case EErros.BAD_REQUEST:
            res.status(error.code).json({ status: "error", error: error.name, message: error.message });
            break;
        case EErros.INTERNAL_SERVER_ERROR:
            res.status(error.code).json({ status: "error", error: error.name, message: error.message });
            break;
        case EErros.UNAUTHORIZED:
            res.status(error.code).json({ status: "error", error: error.name, message: error.message });
            break;
        case EErros.CONFLICT:
            res.status(error.code).json({ status: "error", error: error.name, message: error.message });
            break;
        default:
            res.status(444).json({ status: "error", error: error.name });
            break;
    }
}
