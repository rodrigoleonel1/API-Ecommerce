import winston from "winston"
import config from "./config/config.js"

const customLevels = {
    levels:{
        debug: 5,
        http: 4,
        info: 3,
        warning: 2,
        error: 1,
        fatal: 0
    },
    colors: {
        debug: 'cyan',
        http: 'blue',
        info: 'green',
        warning: 'yellow',
        error: 'red',
        fatal: 'magenta'
    }
}
winston.addColors(customLevels.colors)

const createLogger = (env) =>{
    if(env == 'PROD'){
        return winston.createLogger({
            levels: customLevels.levels,
            transports:[
                new winston.transports.File({
                    level: 'info',
                    filename: 'errors.log',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.simple()
                    )
                })
            ]
        })
    } else{
        return winston.createLogger({
            levels: customLevels.levels,
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                }),
            ]
        })
    }
}

const logger = createLogger(config.ENVIRONMENT)

export default logger