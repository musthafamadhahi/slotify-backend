import { PrismaClient } from '@prisma/client';
import { RegisterData } from './auth.validation';

const prisma = new PrismaClient();

export const findUserByFirebaseId = async (firebaseUid: string) => {
  const user = await prisma.user.findUnique({
    where: { firebaseUid },
    include: { venues: true },
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserByPhoneNumber = async (phoneNumber: string) => {
  return await prisma.user.findUnique({
    where: { phoneNumber: phoneNumber },
  });
};

export const createUser = async (data: RegisterData) => {
  return await prisma.user.create({
    data: {
      firebaseUid: data.firebaseUid ?? '',
      email: data.email!,
      phoneNumber: data.phoneNumber,
      name: data.name,
      role: data.role ?? 'USER',
    },
  });
};
