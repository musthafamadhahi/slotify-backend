import { PrismaClient } from '@prisma/client';
import { CreateCourtData } from './court.validation';

const prisma = new PrismaClient();

export const findUserByFirebaseId = async (firebaseUid: string) => {
  const user = await prisma.user.findUnique({
    where: { firebaseUid },
    select: { email: true, firebaseUid: true },
  });

  return user;
};

export const getAllSports = async () => {
  return await prisma.sport.findMany();
};

export const getValidSports = async (sportIds: number[]) => {
  return await prisma.sport.findMany({
    where: {
      id: { in: sportIds },
    },
    select: { id: true },
  });
};

export const getVenueById = async (venueId: number, userId: number) => {
  return await prisma.venue.findFirst({
    where: {
      id: venueId,
      ownerId: userId,
    },
  });
};

export const createCourt = async (data: CreateCourtData) => {
  return await prisma.$transaction(async (tx) => {
    const court = await tx.court.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim(),
        surface: data.surface,
        size: data.size,
        images: data.images,
        venueId: data.venueId,
        isActive: true,
      },
    });

    // Create court-sport relationships
    const courtSports = await Promise.all(
      data.sportIds.map((sportId) =>
        tx.courtSport.create({
          data: {
            courtId: court.id,
            sportId,
          },
        })
      )
    );

    // Create pricing rules
    const courtPricing = await Promise.all(
      data.pricing.map((rule) =>
        tx.courtPricing.create({
          data: {
            courtId: court.id,
            sportId: rule.sportId || null,
            name: rule.name.trim(),
            dayOfWeek: rule.dayOfWeek,
            startTime: rule.startTime,
            endTime: rule.endTime,
            pricePerHour: Math.round(rule.pricePerHour), // Ensure integer
            minimumDuration: rule.minimumDuration,
            isActive: true,
            validFrom: rule.validFrom ? new Date(rule.validFrom) : null,
            validUntil: rule.validUntil ? new Date(rule.validUntil) : null,
          },
        })
      )
    );

    // Return complete court with relations
    const completeCourt = await tx.court.findUnique({
      where: { id: court.id },
      include: {
        sports: {
          include: {
            sport: true,
          },
        },
        pricing: {
          include: {
            sport: true,
          },
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        },
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    return completeCourt;
  });
};
