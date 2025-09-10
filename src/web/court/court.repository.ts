import { PrismaClient } from '@prisma/client';
import { RegisterData } from './court.validation';

const prisma = new PrismaClient();

export const findUserByFirebaseId = async (firebaseUid: string) => {
  const user = await prisma.user.findUnique({
    where: { firebaseUid },
    select: { email: true, firebaseUid: true },
  });

  return user;
};

interface CreateVenueInput {
  ownerId: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  location?: string;
}

export const createVenueRepo = async (data: CreateVenueInput) => {
  return await prisma.venue.create({
    data: {
      ownerId: data.ownerId,
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      location: data.location,
    },
  });
};
