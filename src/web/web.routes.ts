import express from 'express';
import authRoutes from './auth/auth.routes';

const webRouter = express.Router();

webRouter.use('/auth', authRoutes);

export default webRouter;
