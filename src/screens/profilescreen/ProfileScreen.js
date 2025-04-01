
// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, SafeAreaView, Dimensions } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
// import { launchImageLibrary } from 'react-native-image-picker';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import TextInputComp from '../../components/textinputcomp/TextInputComp';
// import HeaderComponent from '../../components/headercomponent/HeaderComponent';
// import LinearGradient from 'react-native-linear-gradient';
// import GlobalButtonComp from '../../components/button_component/GlobalButtonComp';

// const { width, height } = Dimensions.get('screen');

// const ProfileScreen = ({ navigation }) => {
//   const [userInfo, setUserInfo] = useState({ name: '', email: '', profileImage: null });

//   // Load user info from Firestore
//   useEffect(() => {
//     const loadUserInfo = async () => {
//       try {
//         const user = auth().currentUser;
//         if (user) {
//           const userDoc = await firestore().collection('users').doc(user.uid).get();
//           if (userDoc.exists) {
//             const data = userDoc.data();
//             setUserInfo({
//               name: data.name || '',
//               email: user.email || '',
//               profileImage: data.profileImage || null
//             });
//           } else {
//             setUserInfo({ name: '', email: user.email || '', profileImage: null });
//           }
//         }
//       } catch (error) {
//         console.error('Error loading user info:', error);
//       }
//     };
//     loadUserInfo();
//   }, []);

//   // Select Image from Gallery
//   const selectImage = async () => {
//     const result = await launchImageLibrary({ mediaType: 'photo' });
//     if (result.assets && result.assets.length > 0) {
//       setUserInfo(prev => ({ ...prev, profileImage: result.assets[0].uri }));
//     }
//   };

//   // Upload image to Firebase Storage and Save Profile Data to Firestore
//   const handleSave = async () => {
//     try {
//       const user = auth().currentUser;
//       if (!user) return;

//       let imageUrl = userInfo.profileImage;

//       // Upload image to Firebase Storage if it's a new local image
//       if (userInfo.profileImage && !userInfo.profileImage.startsWith('http')) {
//         const fileName = `profile_${user.uid}.jpg`; // Unique file name
//         const storageRef = storage().ref(`profileImages/${fileName}`);

//         // Upload the file
//         await storageRef.putFile(userInfo.profileImage, { contentType: 'image/jpeg' });

//         // Get the download URL
//         imageUrl = await storageRef.getDownloadURL();
//       }

//       // Save data in Firestore
//       await firestore().collection('users').doc(user.uid).set(
//         { name: userInfo.name, email: user.email, profileImage: imageUrl },
//         { merge: true }
//       );

//       Alert.alert('Success', 'Profile updated successfully!');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update profile.');
//       console.error('Error saving profile:', error);
//     }
//   };

//   // Logout User
//   const handleLogout = async () => {
//     try {
//       await auth().signOut();
//       navigation.replace('SignIn'); // Redirect to SignIn screen
//     } catch (error) {
//       console.error('Logout error:', error);
//       Alert.alert('Error', 'Failed to logout.');
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <HeaderComponent title={'Profile'} onBackPress={() => navigation.goBack()} titleStyle={styles.headerTitle} headerStyle={styles.header} />
//       <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.gradient}>
//         <View style={styles.container}>
//           {/* Profile Image with Edit Icon */}
//           <View style={styles.imageContainer}>
//                         <TouchableOpacity onPress={selectImage}>
//                             <Image
//                                 source={userInfo.profileImage ? { uri: userInfo.profileImage } : require('../../assets/images/profile.png')}
//                                 style={styles.profileImage}
//                             />
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.editIcon} onPress={selectImage}>
//                             <Icon name="edit" size={24} color="#fff" />
//                         </TouchableOpacity>
//                     </View>

//           {/* Name & Email Inputs */}
//           <Text style={{
//             fontFamily: "Montserrat-Medium",
//             fontWeight: '600',
//             fontSize: 15,
//             color: '#FFFFFF',
//             marginBottom: 25,
//             marginVertical: 10,
//             textAlign:'center'
//           }}>User Profile</Text>
//           <Text style={styles.label}>Name</Text>
//           <TextInputComp
//             placeholder="Enter your name"
//             value={userInfo.name}
//             onChangeText={(text) => setUserInfo(prev => ({ ...prev, name: text }))}
//             style={styles.input}
//             inputStyle={styles.inputPlaceholder}
//           />

//           <Text style={styles.label}>Email</Text>
//           <TextInputComp
//             value={userInfo.email}
//             editable={false}
//             style={styles.input}
//             inputStyle={styles.inputPlaceholder}
//           />

//           {/* Save Button */}
//           <GlobalButtonComp title={'Save Profile'} onPress={handleSave} style={styles.btn} textStyle={styles.btnTextStyle} />

//           {/* Logout Button */}
//           <GlobalButtonComp title={'Logout'} onPress={handleLogout} style={styles.btn} textStyle={styles.btnTextStyle} />
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//     alignItems: 'center',
//     paddingVertical: height * 0.02,
//   },
//   container: {
//     // alignItems: 'center',
//     flex: 1,
//     justifyContent: 'center',
//     // alignItems:'center',
//     marginBottom: 50
//   },
//   imageContainer: {
//       marginBottom: 15,
//   },
//   profileImage: {
//       width: width * 0.25,
//       height: height * 0.2,
//       resizeMode: 'contain',
//       alignSelf: 'center',
//   },
//   editIcon: {
//     position: 'absolute',
//     right: 105,
//     bottom: 35,
//     backgroundColor: '#26525A',
//     borderRadius: 12,
//     padding: 4,
//   },
//   label: {
//     fontFamily: "Montserrat-Regular",
//     fontWeight: '500',
//     fontSize: 12,
//     color: '#FFFFFF',
//     marginBottom: 5,
//     marginVertical: 10,
//   },
//   inputPlaceholder: {
//     fontFamily: "Montserrat-Regular",
//     fontWeight: '400',
//     fontSize: 12,
//     lineHeight: 18,
//     color: '#535c60',
//   },
//   input: {
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     height: height * 0.043,
//     paddingHorizontal: 10,
//     width: width * 0.8,
//   },
//   btn: {
//     marginVertical: 20,
//     width: width * 0.80,
//     backgroundColor: '#26525A',
//     borderRadius: 20,
//     marginBottom: 20,
//   },
//   btnTextStyle: {
//     fontFamily: "Montserrat-Regular",
//     fontWeight: '700',
//     fontSize: 14,
//     lineHeight: 18,
//     color: '#FFFFFF',
//   },
//   headerTitle: {
//     fontFamily: "Montserrat-Medium",
//     fontWeight: '600',
//     fontSize: 18,
//     lineHeight: 40,
//     color: "#FFFFFF",
//   },
// });

// export default ProfileScreen;

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalButtonComp from '../../components/button_component/GlobalButtonComp';
import HeaderComponent from '../../components/headercomponent/HeaderComponent';
import TextInputComp from '../../components/textinputcomp/TextInputComp';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

const { height, width } = Dimensions.get('screen');

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profileImage: null,
  });

  // Load user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setUserData({
              name: data.name || '',
              email: user.email || '',
              profileImage: data.profileImage || null,
            });
          } else {
            setUserData({
              name: '',
              email: user.email || '',
              profileImage: null,
            });
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  // Select and compress image from gallery
  const selectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: true, // Get base64 data
      quality: 0.5, // Reduce quality to 50% (0.0 to 1.0, if supported)
      maxWidth: 500, // Limit width to 500px
      maxHeight: 500, // Limit height to 500px
    });

    if (result.assets && result.assets.length > 0) {
      const base64Image = `data:${result.assets[0].type};base64,${result.assets[0].base64}`;

      // Rough size check before setting state
      const imageSizeInBytes = (base64Image.length * 3) / 4; // Approx bytes (base64 -> binary)
      if (imageSizeInBytes > 700000) { // ~700 KB limit to leave room for other fields
        Alert.alert('Image Too Large', 'Please select a smaller image (under 700 KB).');
        return;
      }

      setUserData((prev) => ({ ...prev, profileImage: base64Image }));
    }
  };

  // Save profile data to Firestore
  const handleSave = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'No user logged in.');
        return;
      }

      if (!userData.name) {
        Alert.alert('Error', 'Please enter your name.');
        return;
      }

      // Check total document size
      const jsonString = JSON.stringify(userData);
      const sizeInBytes = new Blob([jsonString]).size;
      if (sizeInBytes > 1e6) { // 1 MB limit
        Alert.alert('Error', 'Profile data exceeds Firestore 1 MB limit. Try a smaller image.');
        return;
      }

      // Save to Firestore
      await firestore().collection('users').doc(user.uid).set(
        {
          name: userData.name,
          email: user.email,
          profileImage: userData.profileImage, // Base64 string
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile.');
    }
  };



  const handleLogout = async () => {
    try {
      await auth().signOut(); 
      Toast.show({
        type: 'success',
        text1: 'Logout Successful',
        text2: 'You have been logged out.',
      });
  
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      }, 1500); // Thoda delay tak toast dikhane ke liye
    } catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'Something went wrong. Try again.',
      });
    }
  };
  
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderComponent
        title={'Profile'}
        onBackPress={() => navigation.goBack()}
        titleStyle={styles.headerTitle}
      />
      <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* Profile Image Section */}
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={selectImage}>
                <Image
                  source={userData.profileImage ? { uri: userData.profileImage } : require('../../assets/images/profile.png')}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editIcon} onPress={selectImage}>
                <Icon name="edit" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            <Text style={styles.label}>Name</Text>
            <TextInputComp
              placeholder="Enter your name"
              value={userData.name}
              onChangeText={(text) => setUserData((prev) => ({ ...prev, name: text }))}
              style={styles.input}
              inputStyle={styles.inputPlaceholder}
            />

            <Text style={styles.label}>Email</Text>
            <TextInputComp
              placeholder="Email"
              value={userData.email}
              editable={false} // Email tied to auth
              style={styles.input}
              inputStyle={styles.inputPlaceholder}
            />

            {/* Save Button */}
            <GlobalButtonComp
              title="Save"
              onPress={handleSave}
              style={styles.btn}
              textStyle={styles.btnTextStyle}
            />

            {/* Logout Button */}
            <GlobalButtonComp
              title="Logout"
              onPress={handleLogout}
              style={styles.btn}
              textStyle={styles.btnTextStyle}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
  container: {
    alignItems: 'center',
    width: width * 0.9,
  },
  imageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: width * 0.26,
    height: height * 0.12,
    resizeMode: 'cover',
    borderRadius: 50
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#26525A',
    borderRadius: 12,
    padding: 4,
  },
  label: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    borderRadius: 8,
    backgroundColor: '#fff',
    height: height * 0.043,
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 15,
  },
  inputPlaceholder: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: '#535c60',
  },
  btn: {
    marginVertical: 10,
    width: '100%',
    backgroundColor: '#26525A',
    borderRadius: 20,
  },
  btnTextStyle: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: "Montserrat-Medium",
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 40,
    color: "#FFFFFF",
  },
});

export default ProfileScreen;