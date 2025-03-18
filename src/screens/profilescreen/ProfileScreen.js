import { Image, SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';


const { height, width } = Dimensions.get('screen')

const ProfileScreen = () => {
  const menuItems = [
    { icon: 'supervised-user-circle', text: 'User Name', type: 'MaterialIcons' },
    { icon: 'phone', text: 'Contact', type: 'MaterialIcons' },
    { icon: 'email', text: 'Email', type: 'MaterialIcons' },
    { icon: 'address', text: 'Address', type: 'Entypo' },
    { icon: 'settings', text: 'Setting', type: 'MaterialIcons' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.gradient}>
        
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/profile.png')}
            style={styles.userprofileImage}
            resizeMode='contain'
          />
          <Text style={styles.heading}>User Profile</Text>

          <View style={{gap: 20}}>
            {menuItems.map((item, index) => (
              <React.Fragment key={item.text}>
                <TouchableOpacity style={styles.listContainer}>
                  {item.type === 'Entypo' ? (
                    <Entypo name={item.icon} size={20} style={styles.icon} />
                  ) : (
                    <Icon name={item.icon} size={20} style={styles.icon} />
                  )}
                  <Text style={styles.text}>{item.text}</Text>
                </TouchableOpacity>
                {index < menuItems.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  userprofileImage: {
    width: width * 0.2,
    height: height * 0.20,
    marginBottom: 20,
  },
  heading: {
    fontWeight: '600',
    fontFamily: "Montserrat-Regular",
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: width * 0.9,
    gap: 12,
  },
  inputWrapper: {
    borderRadius: 12,
    height: height * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  inputField: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
  },
  btn: {
    width: width * 0.85,
    backgroundColor: '#26525A',
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'center'
  },
  signupTextStyle: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    color: '#FFFFFF'
  },
  listContainer: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  text: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
    paddingHorizontal: 10
  },
  icon: {
    fontFamily: "Montserrat-Medium",
    fontWeight: '600',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    width: width * 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
  },

})