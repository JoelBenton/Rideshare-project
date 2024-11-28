import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/src/components/CustomButton';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/src/config/FirebaseConfig';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { Avatar } from "react-native-paper"; 

const ProfileScreen = () => {
  const { user  } = useAuth();
  const router = useRouter();

  if (!user) {
    return
  }

  function handleChangePassword() {
    router.push('/profile/changePassword')
  }

  function handleEditProfile() {  
    return;
  }

  const HandleSignOutPress = () => {
    signOut(FIREBASE_AUTH);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Avatar.Image
          size={128}
          source={require('../../../assets/PlaceholderAvatar.png')}
          style={styles.avatarShadow}
        />
        <Text style={styles.username}>{user.displayName}</Text>
      </View>

      <CustomButton title='Edit Profile' onPress={handleEditProfile} buttonStyle={styles.button} textStyle={styles.buttonText}/>
      <CustomButton title='Change Password' onPress={handleChangePassword} buttonStyle={styles.button} textStyle={styles.buttonText}/>
      <CustomButton title='Ride History' onPress={handleEditProfile} buttonStyle={styles.button} textStyle={styles.buttonText}/>
      <CustomButton title='Log out' onPress={HandleSignOutPress} buttonStyle={styles.button} textStyle={styles.buttonText}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  profileSection: {
    backgroundColor: '#6a0dad',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D3D3D3',
  },
  avatarShadow: {
    resizeMode: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  username: {
    color: '#fff',
    fontSize: 24,
    marginTop: 10,
    fontWeight: '700',
  },
  button: {
    width: '85%',
    backgroundColor: '#D3D3D3',
    marginBottom: 30,
    borderRadius: 12,
    padding: 0,
    height: 40,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#373737',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    fontFamily: 'InknutAntiqua_600SemiBold',
  },
});

export default ProfileScreen;