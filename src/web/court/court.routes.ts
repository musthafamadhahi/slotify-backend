import express from 'express';
import { createCourtController, getSportsController } from './court.controller';
import {
  authenticate,
  ownerAuthenticate,
} from '../../middleware/authMiddleware';

const courtRoutes = express.Router();

courtRoutes.get('/sports', authenticate, getSportsController);
courtRoutes.post('/create', authenticate, createCourtController);
// courtRoutes.post('/create-venue', authenticate, createVenueController);

export default courtRoutes;
