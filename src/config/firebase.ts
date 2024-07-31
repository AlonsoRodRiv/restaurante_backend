import * as admin from 'firebase-admin';
import service_account from './serviceAccountKey.json';

admin.initializeApp({
    credential: admin.credential.cert(service_account as admin.ServiceAccount),
});
export const db = admin.firestore();
export const auth = admin.auth();
