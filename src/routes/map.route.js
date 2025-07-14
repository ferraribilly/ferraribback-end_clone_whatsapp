import express from 'express';
import { getRoute } from '../controllers/map.controller.js';

const router = express.Router();

// Rota para cálculo de rota com base em origem/destino
router.post('/api/v1/route/request', getRoute);

export default router;
