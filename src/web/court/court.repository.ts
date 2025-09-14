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

export const getAllSports = async () => {
  return await prisma.sport.findMany();
};
