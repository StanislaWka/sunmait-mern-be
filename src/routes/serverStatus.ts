import express from 'express';

import controller from '../controllers/serverStatus';

const router = express.Router();

router.get('/', controller.status);

export default router;
