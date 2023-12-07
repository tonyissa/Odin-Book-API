import express from 'express';
const router = express.Router();

import * as apiCont from '../controllers/apiCont.js';

router.get('/', apiCont.index_get);

export default router