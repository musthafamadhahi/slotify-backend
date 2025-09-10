import { Request, Response } from 'express';
import { createVenueRepo } from './court.repository';

export const createCourtController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { message } = req.body;

    console.log(message);

    console.log('Coaurt Crete');

    res.status(201).json({
      message: 'Cort Created successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message:
        err instanceof Error ? err.message : 'An unexpected error occurred',
    });
    return;
  }
};

export const createVenueController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { name, description, address, city, location } = req.body;

    if (!name || !city) {
      res.status(400).json({ message: 'Name and city are required' });
      return;
    }

    const venue = await createVenueRepo({
      ownerId: userId,
      name,
      description,
      address,
      city,
      location,
    });

    res.status(201).json({
      message: 'Venue created successfully',
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
