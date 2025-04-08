
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Image, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderComponent from '../../components/headercomponent/HeaderComponent';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';



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

const pastWorkItems = [
  { id: 1, name: 'John', details: 'Create New Details', image: require('../../assets/images/profile_img.png') },
  { id: 2, name: 'John', details: 'Create New Details', image: require('../../assets/images/profile_img.png') },
  { id: 3, name: 'John', details: 'Create New Details', image: require('../../assets/images/profile_img.png') },
  { id: 4, name: 'John', details: 'Create New Details', image: require('../../assets/images/profile_img.png') },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedBox, setSelectedBox] = useState(null);


  const navigateToScreen = (label) => {
    navigation.navigate('Prep', { label });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.container}>
        <HeaderComponent
          title={'Home'}
          profileImage={require('../../assets/images/user.png')}
          // profileImage={profileImage ? { uri: profileImage } : require('../../assets/images/user.png')} // Use fetched image or default
          headerStyle={styles.header}
          titleStyle={styles.title}
          profileOnPress={() => navigation.navigate('Profile')}
        />

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, currentScreen === 'home' && styles.activeTab]}
            onPress={() => setCurrentScreen('home')}>
            <Text style={[styles.tabText, currentScreen === 'home' && styles.activeTabText]}>Start New Work</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, currentScreen === 'history' && styles.activeTab]}
            onPress={() => setCurrentScreen('history')}>
            <Text style={[styles.tabText, currentScreen === 'history' && styles.activeTabText]}>Past Work History</Text>
          </TouchableOpacity>
        </View>

        {currentScreen === 'home' && (
          <StartNewWork selectedBox={selectedBox} setSelectedBox={setSelectedBox} navigateToScreen={navigateToScreen} />
        )}

        {currentScreen === 'history' && <PastWorkHistory navigation={navigation} />}
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
            onPress={() => handleBoxPress(item)}>
            <Image source={item.image} resizeMode='contain' style={styles.img} />
            <Text style={[styles.boxText, selectedBox === item.id && styles.activeBoxText]}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const PastWorkHistory = ({ navigation }) => {
  const [pastWorkData, setPastWorkData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchPastWork = async () => {
        try {
          const snapshot = await firestore().collection("formData").get();
          const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPastWorkData(fetchedData);
        } catch (error) {
          console.error("Error fetching past work data:", error);
        }
      };

      fetchPastWork();
    }, [])
  );

  return (
    <SafeAreaView style={styles.containerPastWork}>
      <FlatList
        data={pastWorkData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('Prep', { docId: item.id, label: 'Prep' })}
          >
            <Image source={{ uri: item.images?.[0] || 'https://via.placeholder.com/50' }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.projectName}>{item.projectName}</Text>
              {/* <Text style={styles.jobContact}>{item.jobContact}</Text> */}
              <Text style={styles.address}>{item.address}</Text>
              {/* <Text>View History</Text> */}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>

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
    fontSize: 12,
    color: '#9BAFB3',
    textAlign: 'center',
    fontFamily: "Montserrat-Regular",
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
    marginVertical: 5,
    fontFamily: "Montserrat-Medium",
  },
  activeBoxText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 10,
    textAlign: 'center',
    marginVertical: 5,
    fontFamily: "Montserrat-Medium",
  },
  img: {
    width: 25,
    height: 25,
    marginVertical: 5
  },
  pastWorkContainer: {
    paddingHorizontal: 10,
    paddingTop: 20
  },
  pastWorkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#234B52',
    width: width * .95,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  pastWorkTextContainer: {
    flex: 1
  },
  pastWorkName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: "Montserrat-Medium",
  },
  pastWorkDetails: {
    fontSize: 11,
    color: '#9BAFB3',
    fontFamily: "Montserrat-Regular",
    fontWeight: '400'
  },
  arrow: {
    fontSize: 18,
    color: '#FFFFFF'
  },
  containerPastWork: { flex: 1, padding: 10 },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#26525A',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  image: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  textContainer: { flex: 1 },
  projectName: { fontWeight: '600', fontSize: 13, fontFamily: "Montserrat-Medium", color: '#FFFFFF' },
  jobContact: { fontSize: 12, color: 'gray' },
  address: { fontSize: 10, color: '#FFFFFF', fontFamily: "Montserrat-Regular", fontWeight: "500" },
});



