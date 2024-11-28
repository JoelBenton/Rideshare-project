import { User, onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect, createContext, PropsWithChildren } from 'react';
import { FIREBASE_AUTH } from '@/src/config/FirebaseConfig';

interface AuthProps {
  user?: User;
  initialized?: boolean;
}

export const AuthContext = createContext<AuthProps>({});

export function useAuth() {
  return React.useContext(AuthContext);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User>();
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (!user) {
        setInitialized(true);
        setUser(undefined);
      } else {
        setUser(user);
        setInitialized(true);
      }
    });
  }, []);

  const value = {
    user,
    initialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};