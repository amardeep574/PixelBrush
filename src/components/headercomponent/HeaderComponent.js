// Header.js
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any other icon set
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HeaderComponent = ({ onBackPress, title, profileImage, headerStyle, titleStyle,profileOnPress }) => {

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profileImage: null,
  });

  // Load user data from Firestore
  useFocusEffect(
    useCallback(
      () => {
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
      },
      [],
    )
  )
  

  return (
    <View style={[styles.header, headerStyle]}>
      {/* Conditionally render the back button */}
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" /> {/* Changed color to black for better visibility */}
        </TouchableOpacity>
      )}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <TouchableOpacity onPress={profileOnPress}>
        {userData?.profileImage!=="" || userData?.profileImage!==null || userData?.profileImage!==undefined?  <Image source={{uri:userData?.profileImage}} style={styles.profileImage}  />:
         <Image source={ profileImage} style={styles.profileImage}  />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#1E2A30',
    elevation: 4, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: '#000', // Added color for better visibility
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default HeaderComponent;



// import React from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const HeaderComponent = ({ onBackPress, title, profileImage, headerStyle, titleStyle, profileOnPress }) => {
//   return (
//     <View style={[styles.header, headerStyle]}>
//       {/* Back Button */}
//       {onBackPress && (
//         <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="#FFFFFF" />
//         </TouchableOpacity>
//       )}

//       {/* Title */}
//       <Text style={[styles.title, titleStyle]}>{title}</Text>

//       {/* Profile Image */}
//       <TouchableOpacity onPress={profileOnPress} style={styles.profileContainer}>
//         {profileImage ? (
//           <Image source={{ uri: profileImage }} style={styles.profileImage} />
//         ) : (
//           <Icon name="account-circle" size={40} color="#FFFFFF" />
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     height: 56,
//     backgroundColor: '#1E2A30',
//     elevation: 4, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   backButton: {
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginHorizontal: 16,
//     color: '#FFFFFF',
//   },
//   profileContainer: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
// });

// export default HeaderComponent;
