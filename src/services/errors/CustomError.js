export default class CustomError {
    static createError({ name, message, code }) {
        const error = new Error(message);
        error.name = name;
        error.code = code;
        throw error;
    }
}

