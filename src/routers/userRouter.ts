import express from 'express';
import { UserController } from '../controllers/userController';

const router = express.Router();
const userController = new UserController();

router.get('/getall', userController.getUsers.bind(userController));

export default router;
