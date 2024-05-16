import express from 'express';
import vetrogeneratorController from '../controllers/vetrogeneratorController.js';
import VerifyToken from "../middleware/VerifyToken.js";

const router = express.Router();

router.post('/create', VerifyToken, vetrogeneratorController.createVB);

export default router;
