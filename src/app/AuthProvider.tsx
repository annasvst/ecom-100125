'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  signOut,
} from 'firebase/auth';
import { auth, FirebaseError } from '@/lib/firebase';
import { createUser } from '@/lib/firebase';

export interface User extends FirebaseUser {
  firstname?: string;
  lastname?: string;
}

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  error: FirebaseError | null;
};

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<FirebaseError | null>(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser as User);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  });

  const register = async (email: string, password: string) => {
     createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential)  => {
        const user = userCredential.user;
        setUser(user);
        setError(null);
        await createUser (email, user.uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        setError({ code: errorCode, message: errorMessage });
      });
  };

  const login = async (username: string, password: string) => {
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        setError(null);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        setError({ code: errorCode, message: errorMessage });
      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
