import { Router } from 'express'
import logger from '../logger.js';

const router = Router()

router.get('/', async (req, res) =>{
    try {
        logger.debug("Testing debug logger.");
        logger.http("Testing http logger.");
        logger.info("Testing info logger.");
        logger.warning("Testing warning logger.");
        logger.error("Testing error logger.");
        logger.fatal("Testing fatal logger.");
        res.status(200).json({status: 'success', message: "Logger test completed."})
    } catch (error) {
        logger.error(error)
    }
})

export default router