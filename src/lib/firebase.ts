import { User } from '@/app/AuthProvider';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { collection, addDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? ''
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const getUIErrorFromFirebaseError = (firebaseErrorCode: string) => {
  switch (firebaseErrorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email address is already registered';

    default:
      return 'An error occured';
  }
};

interface FirestoreResponse {
  success: boolean;
  error?: FirebaseError;
}

export interface FirebaseError {
  code: string;
  message: string;
}

export async function updateUser(user: User): Promise<FirestoreResponse> {
  const { uid: userID, firstname, lastname } = user;
  console.log('Updating user. User is', user);

  try {
    const currentTime = new Date().toISOString();

    const userQuery = query(
      collection(db, 'users'),
      where('userID', '==', userID),
    );
    const querySnapshot = await getDocs(userQuery);
    let userDocId; 
    querySnapshot.forEach((doc) => userDocId = doc.id);

    if (!userDocId) return {
      success: false,
      error: { code: 'unknown', message: 'User is not found.' },
    };

    const docRef = await setDoc(
      doc(db, 'users', userDocId),
      {
        userID: userID,
        createdAt: currentTime,
        updatedAt: currentTime,
        firstname,
        lastname,
      },
      { merge: true },
    );

    console.log('Document written with ID: ', docRef);
    return { success: true };
  } catch (e) {
    if (typeof e === 'object' && e !== null && 'code' in e && 'message' in e) {
      return {
        success: false,
        error: { code: (e as FirebaseError).code, message: (e as FirebaseError).message },
      };
    }
    return {
      success: false,
      error: { code: 'unknown', message: 'An unknown error occurred' },
    };
  }
}

export async function createUser(
  email: string,
  userId: string,
): Promise<FirestoreResponse> {
  try {
    const currentTime = new Date().toISOString();

    const docRef = await addDoc(collection(db, 'users'), {
      email: email,
      userID: userId,
      createdAt: currentTime,
      updatedAt: currentTime,
    });
    console.log('Document written with ID: ', docRef.id);
    return { success: true };
  } catch (e) {
    if (typeof e === 'object' && e !== null && 'code' in e && 'message' in e) {
      return {
        success: false,
        error: { code: (e as FirebaseError).code, message: (e as FirebaseError).message },
      };
    }
    return {
      success: false,
      error: { code: 'unknown', message: 'An unknown error occurred' },
    };
  }
}
