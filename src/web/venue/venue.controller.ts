import { Request, Response } from 'express';
import {
  createCity,
  createVenue,
  findCityByName,
  getAllDistricts,
  getVenue,
} from './venue.repository';
import { mockDistricts } from '../../utils/districts';
import { CreateVenueData } from './venue.types';

export const getAllDistrictsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const districts = await getAllDistricts();

    res.status(200).json({
      message: 'Districts retrieved successfully',
      districts,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message:
        err instanceof Error ? err.message : 'An unexpected error occurred',
    });
  }
};

export const getCityByDistrictController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const districtId = parseInt(req.params.districtId);

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const cities = mockDistricts.find(
      (district) => district.id === districtId
    )?.cities;

    res.status(200).json({
      message: 'Cities retrieved successfully',
      cities,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message:
        err instanceof Error ? err.message : 'An unexpected error occurred',
    });
  }
};

export const getVenueController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const venue = await getVenue(userId);

    res.status(200).json({
      message: venue ? 'Venue retrieved successfully' : 'Create your venue',
      venue,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message:
        err instanceof Error ? err.message : 'An unexpected error occurred',
    });
  }
};
export const createVenueController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    console.log('Creating venue for user ID:', userId);
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const venueData: CreateVenueData = req.body;

    // Validate required fields
    if (!venueData.name || !venueData.address) {
      res.status(400).json({
        message: 'Venue name and address are required',
      });
      return;
    }

    let cityId = 0;

    const existingCity = await findCityByName(venueData.city.city);

    if (existingCity) {
      cityId = existingCity.id;
    } else {
      const newCity = await createCity(
        venueData.city.city,
        venueData.city.code,
        venueData.districtId
      );
      cityId = newCity.id;
    }

    const venueToCreate = {
      ...venueData,
      cityId,
      country: venueData.country || 'Sri Lanka',
      amenities: venueData.amenities || [],
      images: venueData.images || [],
      openingHours: venueData.openingHours || [],
    };

    const venue = await createVenue(venueToCreate, userId);

    res.status(201).json({
      message: 'Venue created successfully',
      venue,
    });
  } catch (err) {
    console.error('Error in createVenueController:', err);

    if (err instanceof Error && err.message.includes('Unique constraint')) {
      res.status(409).json({
        message: 'A venue with this name or details already exists',
      });
      return;
    }

    res.status(500).json({
      message:
        err instanceof Error ? err.message : 'An unexpected error occurred',
    });
  }
};
