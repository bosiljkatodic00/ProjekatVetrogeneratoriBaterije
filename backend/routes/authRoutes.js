import express from 'express';
import authController from '../controllers/authController.js';
import VerifyToken from "../middleware/VerifyToken.js";

const router = express.Router();

router.post('/register', VerifyToken, authController.register);
router.post('/login', VerifyToken, authController.login);

export default router;
