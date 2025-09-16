import { Request, Response } from 'express';
import {
  createCourt,
  getAllSports,
  getValidSports,
  getVenueById,
} from './court.repository';

interface CreateCourtPricing {
  sportId?: number;
  name: string;
  dayOfWeek?: number | null;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  minimumDuration: number;
  validFrom?: string;
  validUntil?: string;
}

interface CreateCourtRequest {
  name: string;
  description?: string;
  surface?: string;
  size?: string;
  images: string[];
  sportIds: number[];
  venueId: number;
  pricing: CreateCourtPricing[];
}

export const createCourtController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      surface,
      size,
      images,
      sportIds,
      venueId,
      pricing,
    }: CreateCourtRequest = req.body;

    // Validation
    if (!name || !name.trim()) {
      res.status(400).json({
        message: 'Court name is required',
      });
      return;
    }

    if (!venueId) {
      res.status(400).json({
        message: 'Venue ID is required',
      });
      return;
    }

    if (!sportIds || sportIds.length === 0) {
      res.status(400).json({
        message: 'At least one sport must be selected',
      });
      return;
    }

    if (!pricing || pricing.length === 0) {
      res.status(400).json({
        message: 'At least one pricing rule is required',
      });
      return;
    }

    // Validate venue exists and belongs to user (assuming you have user context)
    const venue = await getVenueById(venueId, req.user.id!);

    if (!venue) {
      res.status(404).json({
        message: 'Venue not found or access denied',
      });
      return;
    }

    const validSports = await getValidSports(sportIds);

    if (validSports.length !== sportIds.length) {
      res.status(400).json({
        message: 'One or more selected sports are invalid',
      });
      return;
    }

    // Validate pricing rules
    for (const rule of pricing) {
      if (!rule.name || !rule.name.trim()) {
        res.status(400).json({
          message: 'Pricing rule name is required',
        });
        return;
      }

      if (!rule.startTime || !rule.endTime) {
        res.status(400).json({
          message: 'Start time and end time are required for pricing rules',
        });
        return;
      }

      if (rule.startTime >= rule.endTime) {
        res.status(400).json({
          message: `Invalid time range for pricing rule "${rule.name}": end time must be after start time`,
        });
        return;
      }

      if (rule.pricePerHour <= 0) {
        res.status(400).json({
          message: `Invalid price for pricing rule "${rule.name}": price must be greater than 0`,
        });
        return;
      }

      if (rule.minimumDuration < 15) {
        res.status(400).json({
          message: `Invalid minimum duration for pricing rule "${rule.name}": must be at least 15 minutes`,
        });
        return;
      }

      // Validate day of week if provided
      if (rule.dayOfWeek !== null && rule.dayOfWeek !== undefined) {
        if (rule.dayOfWeek < 0 || rule.dayOfWeek > 6) {
          res.status(400).json({
            message: `Invalid day of week for pricing rule "${rule.name}": must be between 0-6`,
          });
          return;
        }
      }

      // Validate sport ID if provided
      if (rule.sportId && !sportIds.includes(rule.sportId)) {
        res.status(400).json({
          message: `Invalid sport ID in pricing rule "${rule.name}": sport must be selected for the court`,
        });
        return;
      }
    }

    // Check for pricing conflicts
    for (let i = 0; i < pricing.length; i++) {
      for (let j = i + 1; j < pricing.length; j++) {
        const rule1 = pricing[i];
        const rule2 = pricing[j];

        // Check if rules conflict (same day, same sport, overlapping time)
        const sameDay = rule1.dayOfWeek === rule2.dayOfWeek;
        const sameSport = rule1.sportId === rule2.sportId;
        const timeOverlap = !(
          rule1.endTime <= rule2.startTime || rule1.startTime >= rule2.endTime
        );

        if (sameDay && sameSport && timeOverlap) {
          res.status(400).json({
            message: `Pricing rules "${rule1.name}" and "${rule2.name}" have conflicting time slots`,
          });
          return;
        }
      }
    }

    const court = await createCourt({
      name,
      description,
      surface,
      size,
      images,
      sportIds,
      venueId,
      pricing,
    });

    console.log(`Court "${name}" created successfully with ID: ${court.id}`);

    res.status(201).json({
      message: 'Court created successfully',
      court: court,
    });
  } catch (err) {
    console.error('Error creating court:', err);

    if (err instanceof Error) {
      if (err.message.includes('Unique constraint')) {
        res.status(409).json({
          message: 'A court with this name already exists in this venue',
        });
        return;
      }

      if (err.message.includes('Foreign key constraint')) {
        res.status(400).json({
          message: 'Invalid venue or sport reference',
        });
        return;
      }
    }

    res.status(500).json({
      message:
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while creating the court',
    });
  }
};

// Helper function to validate time format (HH:MM)
const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Helper function to check if pricing rules have conflicts
const hasPricingConflict = (
  rule1: CreateCourtPricing,
  rule2: CreateCourtPricing
): boolean => {
  // Same day (or both apply to all days)
  const sameDay = rule1.dayOfWeek === rule2.dayOfWeek;

  // Same sport (or both apply to all sports)
  const sameSport = rule1.sportId === rule2.sportId;

  // Time overlap
  const timeOverlap = !(
    rule1.endTime <= rule2.startTime || rule1.startTime >= rule2.endTime
  );

  return sameDay && sameSport && timeOverlap;
};

// Additional helper function to format court data for response
const formatCourtResponse = (court: any) => {
  return {
    ...court,
    pricing: court.pricing.map((p: any) => ({
      ...p,
      pricePerHour: p.pricePerHour, // Keep as integer (cents/paisa)
      priceDisplay: `Rs. ${(p.pricePerHour / 100).toFixed(2)}`, // Formatted for display
    })),
  };
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
