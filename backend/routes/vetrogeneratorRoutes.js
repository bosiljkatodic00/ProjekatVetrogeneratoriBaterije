import express from 'express';
import vetrogeneratorController from '../controllers/vetrogeneratorController.js';
import VerifyToken from "../middleware/VerifyToken.js";

const router = express.Router();

router.post('/create', VerifyToken, vetrogeneratorController.createVB);
router.get('/vetrogenerators', VerifyToken, vetrogeneratorController.getVForUser);
router.get('/batteries', VerifyToken, vetrogeneratorController.getBForUser);


export default router;
