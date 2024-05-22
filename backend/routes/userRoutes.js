import express from 'express';
import userController from '../controllers/userController.js';
import VerifyToken from "../middleware/VerifyToken.js";

const router = express.Router();

router.get('/allUsers', VerifyToken, userController.getAllUsers);

export default router;
