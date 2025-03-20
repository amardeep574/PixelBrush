import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for back icon

const DisplayPastHistory = ({ route }) => {
  const navigation = useNavigation();
  const { item } = route.params; // Get passed data

  return (
    <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item.name} Past History</Text>
      </View>

      <View style={styles.content}>
        <Image source={item.image} style={styles.profileImg} />
        <Text style={styles.details}>{item.details}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1E2A30',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 10, // Adjust spacing
  },
  content: {
    alignItems: 'center',
    marginTop: 50,
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default DisplayPastHistory;
