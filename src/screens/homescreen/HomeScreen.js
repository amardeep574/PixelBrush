import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Image, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderComponent from '../../components/headercomponent/HeaderComponent';
import { useNavigation } from '@react-navigation/native';
// import customFonts from '../../theme/customFonts';

const { width } = Dimensions.get('screen');

const menuItems = [
  { id: 1, label: 'Prep', image: require('../../assets/images/prep.png') },
  { id: 2, label: 'Siding sq feet', image: require('../../assets/images/siding.png') },
  { id: 3, label: 'Soffit lin. feet', image: require('../../assets/images/soffit.png') },
  { id: 4, label: 'Windows', image: require('../../assets/images/window.png') },
  { id: 5, label: 'Doors', image: require('../../assets/images/open-door.png') },
  { id: 6, label: 'Misc', image: require('../../assets/images/misc.png') },
  { id: 7, label: 'Special cons', image: require('../../assets/images/special_cons.png') },
  { id: 8, label: 'Railing', image: require('../../assets/images/railing.png') },
];
                                                                                                                              
export default function HomeScreen() {
  const navigation = useNavigation();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedBox, setSelectedBox] = useState(null);

  const navigateToScreen = (label) => {
    console.log({ label })
    navigation.navigate('Prep', { label });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.container}>
        <HeaderComponent
          title={'Home'}
          profileImage={require('../../assets/images/profile_img.png')}
          headerStyle={styles.header}
          titleStyle={styles.title}
          profileOnPress={() => navigation.navigate('Profile')}
          // profileOnPress={() => navigation.navigate('LazyLoading')}
        />

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, currentScreen === 'home' && styles.activeTab]}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={[styles.tabText, currentScreen === 'home' && styles.activeTabText]}>Start New Work</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, currentScreen === 'history' && styles.activeTab]}
            onPress={() => navigation.navigate('PastworkHistory')}
          >
            <Text style={[styles.tabText, currentScreen === 'history' && styles.activeTabText]}>Past Work History</Text>
          </TouchableOpacity>
        </View>

        {currentScreen === 'home' && (
          <StartNewWork selectedBox={selectedBox} setSelectedBox={setSelectedBox} navigateToScreen={(label) => navigateToScreen(label)} />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const StartNewWork = ({ selectedBox, setSelectedBox, navigateToScreen }) => {
  const handleBoxPress = (item) => {
    setSelectedBox(item.id);
    navigateToScreen(item.label);
  };

  return (
    <View style={styles.menuContainer}>
      <FlatList
        data={menuItems}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.box, selectedBox === item.id && styles.activeBox]}
            onPress={() => handleBoxPress(item)}
          >
            <Image source={item.image} resizeMode='contain' style={styles.img} />
            <Text style={[styles.boxText, selectedBox === item.id && styles.activeBoxText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#26525A'
  },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: "Montserrat-Medium",
    lineHeight: 40
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1E2A30'
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12
  },
  tabText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: '#9BAFB3',
    fontFamily: '400',
    textAlign: 'center'
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: "Montserrat-Regular",
  },
  menuContainer: {
    paddingHorizontal: 10,
    paddingTop: 20
  },
  box: {
    width: (width / 3) - 25,
    height: 80,
    backgroundColor: '#C6DAE5',
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBox: {
    backgroundColor: '#26525A'
  },
  boxText: {
    color: '#102226',
    fontWeight: '600',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 10,
    marginVertical: 5,
    fontFamily: "Montserrat-Medium",
  },
  activeBoxText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 10,
    marginVertical: 5,
    fontFamily: "Montserrat-Medium",
  },
  img: {
    width: 25,
    height: 25,
    marginVertical: 5
  },
});
