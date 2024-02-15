import {devLogger} from './dev.logger.js'
import {productionLogger} from './production.logger.js'

let logger = null;

if (process.env.NODE_ENV === "production") {
    logger = productionLogger()
} else {
    logger = devLogger()
}

export {logger}