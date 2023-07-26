import mongoose from 'mongoose';
import config from '../../config/config.js'
import logger from '../../helpers/logger.js';

const URI = config.MONGO_URL || 'mongodb://localhost:27017/ecommerce';
mongoose.set('strictQuery', false);
mongoose.connect(URI, () => {
    logger.info('Mongo DB connected!');
})