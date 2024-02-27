import  {logger} from '../utils/logger/index.js'

export const loggerInRequest = (req, res, next) => {
    req.logger = logger
    req.logger.info(`>>>>>>> ${req.method} en ${req.url}`)
    next()
}