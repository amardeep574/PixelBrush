import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, SafeAreaView, ImageBackground } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons'; 
import { slideData } from '../../utils/StaticData';
// import customFonts from '../../theme/customFonts';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slideData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('SignIn'); // Replace with your target screen
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1, animated: true });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    navigation.replace('SignIn'); // Skip onboarding
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={slideData}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          renderItem={({ item }) => (

            <View style={{ width: width, height: height }}>
              <ImageBackground source={item.image} style={[styles.image, { flex: 1 }]} resizeMode='cover'>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </ImageBackground>
            </View>

          )}
        />

        {/* Footer Navigation */}
        <View style={styles.footer}>
          {/* Left side button: Skip on first screen, Back on second screen */}
          {currentIndex === 0 ? (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.text}>Skip</Text>
            </TouchableOpacity>
          ) : currentIndex === 1 ? (
            <TouchableOpacity onPress={handlePrevious} style={styles.button}>
              {/* <Icon name="arrow-back" size={24} color="white" /> */}
              <Text style={styles.text}>Back</Text>

            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} /> // Empty View to keep layout aligned
          )}

          {/* Right side button: Next on first & second screens, Get Started on last screen */}
          {currentIndex === slideData.length - 1 ? (
            <TouchableOpacity onPress={handleNext} style={styles.getStartedButton}>
              <Text style={styles.textGetStartedButton}>Get Started</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleNext} style={styles.button}>
              {/* <Icon name="arrow-forward" size={24} color="white" /> */}
              <Image source={require('../../assets/images/RoundNext.png')} style={styles.imgNextIcon} resizeMode='contain' />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
    // position: 'absolute',
  },
  textContainer: {
    // position: 'absolute',
    // bottom: 190,
    // alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    // paddingHorizontal: 55,
    // backgroundColor:'red'
    paddingBottom: height * 0.18
  },
  title: {
    fontFamily: "Montserrat-Bold",
    color: '#1E1E1E',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: "600",
    lineHeight: 40,

  },
  description: {
    fontFamily: "Montserrat-Regular",
    fontWeight:'400',
    color: '#102226',
    fontSize: 12,
    textAlign: 'center',
    // marginTop: 10,
    lineHeight: 16,
    paddingHorizontal:50,
    fontWeight: '400',
    // width:width*.7,
    
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,

  },
  button: {
    // padding: 10,
    borderRadius: 50,
    
  },
  getStartedButton: {
    backgroundColor: '#26525A', // Custom color for Get Started
    // paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    // width: width * .35,
    // height: height * .035
  },
  skipButton: {
    padding: 10,
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 40,
  },
  text: {
    color: '#102226',
    fontSize: 15,
    lineHeight: 30,
    textAlign: 'center',
    fontWeight: 600
  },
  imgNextIcon: {
    width: 45,
    height: 45
  },
  textGetStartedButton: {
    fontFamily: "Montserrat-Bold",
    color: '#E9EBF8',
    fontSize: 15,
    lineHeight: 40,
    textAlign: 'center',
    fontWeight: "600"
  }
});
