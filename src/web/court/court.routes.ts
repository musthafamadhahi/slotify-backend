import express from 'express';
import {
  createCourtController,
  createVenueController,
} from './court.controller';
import {
  authenticate,
  ownerAuthenticate,
} from '../../middleware/authMiddleware';

const courtRoutes = express.Router();

courtRoutes.post('/create', authenticate, createCourtController);
courtRoutes.post('/create-venue', authenticate, createVenueController);

export default courtRoutes;
