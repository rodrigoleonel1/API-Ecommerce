import { Router } from 'express';
import logger from '../helpers/logger.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        logger.debug("Testing debug logger.");
        logger.http("Testing http logger.");
        logger.info("Testing info logger.");
        logger.warning("Testing warning logger.");
        logger.error("Testing error logger.");
        logger.fatal("Testing fatal logger.");
        res.status(200).json({ status: 'success', message: "Logger test completed" })
    } catch (error) {
        next(error);
    }
})

export default router;