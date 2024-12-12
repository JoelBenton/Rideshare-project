import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthContext, AuthProvider } from '@/src/context/AuthContext';
import { useContext, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@store/index';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 15, // 15 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

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
    <Provider store={store}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <InitialLayout />
        </QueryClientProvider>
      </AuthProvider>
    </Provider>
  );
};

export default RootLayout;