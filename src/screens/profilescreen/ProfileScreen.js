import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import TextInputComp from '../../components/textinputcomp/TextInputComp';
import GlobalButtonComp from '../../components/button_component/GlobalButtonComp';
import HeaderComponent from '../../components/headercomponent/HeaderComponent';

const { height, width } = Dimensions.get('screen');

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <HeaderComponent title={'Profile'} onBackPress={() => navigation.goBack()} titleStyle={styles.headerTitle} />
      <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.gradient}>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginBottom: "25%" }}>

          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/profile.png')}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editIcon}>
              <Icon name="edit" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Name</Text>
            <TextInputComp
              style={styles.input}
              inputStyle={styles.inputPlaceholder}
              value="John Dhuran"
            />
            <Text style={styles.label}>E-mail</Text>
            <TextInputComp
              style={styles.input}
              inputStyle={styles.inputPlaceholder}
              value="johndhuran@gmail.com"
            />
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
            <Entypo name="log-out" size={16} color="#fff" />
          </TouchableOpacity>

        </View>
        {/* Save Button */}
        <GlobalButtonComp title="Save" style={styles.saveButton} textStyle={styles.saveText} />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
  headerStyle: {
    marginTop: 0,
  },
  headerTitle: {
    fontFamily: "Montserrat-Medium",
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 40,
    color: "#FFFFFF",
  },
  inputPlaceholder: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: '#535c60'
},

  imageContainer: {

    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#26525A',
    borderRadius: 20,
    padding: 6,
  },
  inputWrapper: {
    width: width * 0.85,
    marginBottom: 20,
  },
  label: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 5,
    marginVertical:10
  },
  input: {
    borderRadius: 8,
    backgroundColor: '#fff',
    height: height * .043,
    paddingHorizontal: 10,
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.85,
    backgroundColor: '#26525A',
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  logoutText: {
    fontFamily: "Montserrat-Bold",
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    color: '#FFFFFF'
  },
  saveButton: {
    width: width * 0.85,
    backgroundColor: '#26525A',
    borderRadius: 25,
    // paddingVertical: 12,
  },
  saveText: {
    fontFamily: "Montserrat-Bold",
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    color: '#FFFFFF'
  },
});
