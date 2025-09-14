import { Request, Response } from 'express';
import { getAllSports } from './court.repository';

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

export const getSportsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const sports = await getAllSports();

    res.status(200).json({
      sports,
      message: 'Sports retrieved successfully',
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
