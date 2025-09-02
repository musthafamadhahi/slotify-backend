import { Request, Response } from 'express';
import admin from '../../config/firebase';
import { createUser, findUserByFirebaseId } from './auth.repository';

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { idToken, email, phoneNumber, name } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken) {
      res.status(401).json({ error: 'Invalid Firebase ID' });
      return;
    }

    const firebaseUid = decodedToken.uid;

    const existingUser = await findUserByFirebaseId(firebaseUid);

    if (existingUser) {
      res.status(201).json({
        message: 'User already registered',
        user: existingUser,
      });
      return;
    }

    if (phoneNumber && !phoneNumber.startsWith('+')) {
      phoneNumber = `+${phoneNumber}`;
    }

    const newUser = await createUser({
      firebaseUid,
      email,
      phoneNumber,
      name,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
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
