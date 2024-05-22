import express from 'express';
import userController from '../controllers/userController.js';
import VerifyToken from "../middleware/VerifyToken.js";

const router = express.Router();

router.get('/allUsers', VerifyToken, userController.getAllUsers);
router.post('/block', VerifyToken, userController.blockUser);


export default router;
