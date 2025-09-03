import admin, { ServiceAccount } from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  : null;

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
