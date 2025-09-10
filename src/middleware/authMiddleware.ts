import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import admin from '../config/firebase';

declare global {
  namespace Express {
    export interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export interface AuthenticatedUser {
  id: number;
  firebaseId: string;
}

const prisma = new PrismaClient();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  console.log('authorization code is', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    console.log('user is ', user);

    if (!user) {
      console.log('user is not found');
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = {
      id: user.id,
      firebaseId: user.firebaseUid,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
};

export const ownerAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user || user.role !== 'OWNER') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    if (!user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = {
      id: user.id,
      firebaseId: user.firebaseUid,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
};
