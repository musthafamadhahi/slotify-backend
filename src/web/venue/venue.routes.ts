import express from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import {
  createVenueController,
  getAllDistrictsController,
  getCityByDistrictController,
  getVenueController,
} from './venue.controller';

const venueRoutes = express.Router();

venueRoutes.get('/my-venue', authenticate, getVenueController);
venueRoutes.get('/districts', authenticate, getAllDistrictsController);
venueRoutes.get(
  '/cities/:districtId',
  authenticate,
  getCityByDistrictController
);
venueRoutes.post('/create', authenticate, createVenueController);

export default venueRoutes;
