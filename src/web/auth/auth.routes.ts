import express from 'express';
import { loginController } from './auth.controller';

const authRoutes = express.Router();

authRoutes.post('/login', loginController);

export default authRoutes;
