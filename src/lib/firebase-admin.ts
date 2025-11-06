import * as admin from "firebase-admin";

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};
console.log('Service Account:', serviceAccount.privateKey);

function getFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  return admin;
}

const firebaseAdmin = getFirebaseAdmin();

export const adminAuth = firebaseAdmin.auth();
export const adminDB = firebaseAdmin.firestore();


export async function getUser(userId: string) {
  console.log('Collections', await adminDB.listCollections());

  const userSnap = await adminDB.collection('users').doc(userId).get();
  console.log('userSnap', userSnap);
  
  return userSnap.data();
}