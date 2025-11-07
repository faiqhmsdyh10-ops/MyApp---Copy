import express from 'express';
import { getUsers, createUser, registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
