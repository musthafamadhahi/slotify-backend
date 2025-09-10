import express from 'express';
import authRoutes from './auth/auth.routes';
import courtRoutes from './court/court.routes';

const webRouter = express.Router();

webRouter.use('/auth', authRoutes);
webRouter.use('/court', courtRoutes);

export default webRouter;
