import admin, { ServiceAccount } from 'firebase-admin';
import dotenv from 'dotenv';
import serviceAccount from './serviceAccount.json';

dotenv.config();

// ✅ Ensure Firebase is initialized only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;
export const adminAuth = admin.auth(); // ✅ Export Auth separately
