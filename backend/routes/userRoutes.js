import express from 'express';
import { getUsers, createUser, registerUser, loginUser, getUserProfileByEmail, updateUserProfileByEmail } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:email', getUserProfileByEmail);
router.put('/profile/:email', updateUserProfileByEmail);

export default router;
