import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthContext, AuthProvider } from '@/src/context/AuthContext';
import { useContext, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

const InitialLayout = () => {
  const { user, initialized } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!initialized) return;

    if (user) {
      router.replace('/(tabs)/home');
    } else if (!user) {
      router.replace('/(auth)/login');
    }
  }, [user, initialized]); // Runs when either user or initialised is changed

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