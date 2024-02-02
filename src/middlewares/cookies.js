import cookieParser from 'cookie-parser'
import { JWT_COOKIE_SECRET } from '../config/config.js'

export const cookies = cookieParser(JWT_COOKIE_SECRET)