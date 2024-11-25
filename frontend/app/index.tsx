import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

const StartPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  if (user) {
    router.replace('/(tabs)/home');
  } else {
    router.replace('/(auth)/login');
  }

  return (
    <View />
  );
};

export default StartPage;