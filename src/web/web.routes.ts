import express from 'express';
import authRoutes from './auth/auth.routes';
import courtRoutes from './court/court.routes';
import venueRoutes from './venue/venue.routes';

const webRouter = express.Router();

webRouter.use('/auth', authRoutes);
webRouter.use('/court', courtRoutes);
webRouter.use('/venue', venueRoutes);

export default webRouter;
