import { StyleSheet, Text, View, Dimensions, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();

//   useEffect(() => {
//     checkUserLogin();  // Check if user is already logged in
// }, []);

// const checkUserLogin = async () => {
//     try {
//         const storedUser = await AsyncStorage.getItem('userInfo');
//         if (storedUser) {
//             navigation.replace('Home');  // Auto-navigate to Home if user info exists
//         }
//     } catch (error) {
//         console.error('Error checking stored user:', error);
//     }
// };

//   useEffect(() => {
//     const checkFirstLaunch = async () => {
//       try {
//         const hasLaunched = await AsyncStorage.getItem('hasLaunched');
//         setTimeout(() => {
//           if (hasLaunched === null) {
//             AsyncStorage.setItem('hasLaunched', 'true');
//             navigation.replace('OnboardingScreen'); // First-time launch
//           } else {
//             navigation.replace('SignIn'); // Returning user
//           }
//         }, 2000); // 2-second splash screen delay
//       } catch (error) {
//         console.log('Error checking first time launch', error);
//       }
//     };

//     checkFirstLaunch();
//   }, []);


useEffect(() => {
  const checkAppStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (storedUser) {
        navigation.replace('Home'); // Navigate to Home if user is logged in
        return;
      }

      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      setTimeout(() => {
        if (!hasLaunched) {
          AsyncStorage.setItem('hasLaunched', 'true');
          navigation.replace('OnboardingScreen'); // First-time launch
        } else {
          navigation.replace('SignIn'); // Returning user
        }
      }, 2000); // 2-second splash delay
    } catch (error) {
      console.error('Error checking app status:', error);
    }
  };

  checkAppStatus();
}, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.gradient}>
        <View style={styles.container}>
          {/* <Text style={styles.textItem}>Loading...</Text> */}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textItem: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
  },
});

