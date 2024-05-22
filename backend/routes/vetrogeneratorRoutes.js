import express from 'express';
import vetrogeneratorController from '../controllers/vetrogeneratorController.js';
import VerifyToken from "../middleware/VerifyToken.js";

const router = express.Router();

router.post('/create', VerifyToken, vetrogeneratorController.createVB);
router.get('/vetrogenerators', VerifyToken, vetrogeneratorController.getVForUser);
router.get('/batteries', VerifyToken, vetrogeneratorController.getBForUser);
router.get('/allVetrogenerators', VerifyToken, vetrogeneratorController.getAllVetrogenerators);
router.get('/allBatteries', VerifyToken, vetrogeneratorController.getAllBatteries);


export default router;
