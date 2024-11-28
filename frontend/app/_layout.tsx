import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthContext, AuthProvider } from '@/src/context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

const InitialLayout = () => {
  const { user, initialized } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!initialized) return;
    const inTabsGroup = segments[0] === '(tabs)';
    const inAuthGroup = segments[0] === '(auth)';

    // Dont redirect if in auth group
    if (inAuthGroup) return;
    if (user && !inTabsGroup) {
      router.replace('/home');
    } else if (!user) {
      router.replace('/(auth)/login');
    }
  }, [user, initialized]);

  return <>{initialized ? <Slot /> : <ActivityIndicator size='large' />}</>;
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
};

export default RootLayout;