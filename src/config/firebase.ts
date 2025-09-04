import admin, { ServiceAccount } from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
};

if (!serviceAccount) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not defined');
}

// ✅ Ensure Firebase is initialized only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;
export const adminAuth = admin.auth(); // ✅ Export Auth separately
