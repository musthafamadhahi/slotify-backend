import { PrismaClient } from '@prisma/client';
import { CreateVenueData } from './venue.types';

const prisma = new PrismaClient();

export const getAllDistricts = async () => {
  const districts = await prisma.district.findMany();
  return districts;
};

export const findCityByName = async (city: string) => {
  return await prisma.city.findFirst({
    where: { city },
  });
};

export const createCity = async (
  city: string,
  code: string,
  districtId: number
) => {
  return await prisma.city.create({
    data: { city, code, districtId },
  });
};

export const getVenue = async (userId: number) => {
  return await prisma.venue.findFirst({
    where: { ownerId: userId },
    include: {
      openingHours: {
        where: { isActive: true },
        orderBy: { dayOfWeek: 'asc' },
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      city: true,
      district: true,
      courts: true,
    },
  });
};

export const createVenue = async (
  venueData: CreateVenueData,
  ownerId: number
) => {
  return await prisma.$transaction(async (tx) => {
    // First create the venue
    const venue = await tx.venue.create({
      data: {
        name: venueData.name,
        description: venueData.description,
        address: venueData.address,
        country: venueData.country,
        latitude: venueData.latitude,
        longitude: venueData.longitude,
        phoneNumber: venueData.phoneNumber,
        email: venueData.email,
        website: venueData.website,
        amenities: venueData.amenities,
        images: venueData.images,
        isActive: true,

        owner: { connect: { id: ownerId } },
        city: { connect: { id: venueData.cityId } },
        district: { connect: { id: venueData.districtId } },
      },
    });

    // Create opening hours
    if (venueData.openingHours && venueData.openingHours.length > 0) {
      await tx.venueOpeningHour.createMany({
        data: venueData.openingHours.map((hour) => ({
          venueId: venue.id,
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isActive: hour.isActive,
        })),
      });
    }

    // Return venue with relations
    return await tx.venue.findUnique({
      where: { id: venue.id },
      include: {
        openingHours: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        city: true,
        district: true,
        courts: true,
      },
    });
  });
};
