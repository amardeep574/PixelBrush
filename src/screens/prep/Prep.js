import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions, FlatList, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderComponent from '../../components/headercomponent/HeaderComponent';
import TextInputComp from '../../components/textinputcomp/TextInputComp';
import DropdownComp from '../../components/dropdown/DropdownComp';
import { launchImageLibrary } from 'react-native-image-picker';
import GlobalButtonComp from '../../components/button_component/GlobalButtonComp';
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';



const { height, width } = Dimensions.get('screen');
const MAX_IMAGES = 10;

const taskData = [
  { title: 'Area Sand (sq ft)', fields: ['bldg1', 'bldg2', 'bldg3', 'bldg4', 'total', 'rate/hour', 'finalTotal'] },
  { title: 'Caulk (lin ft)', fields: ['bldg1', 'bldg2', 'bldg3', 'bldg4', 'total', 'rate/hour', 'finalTotal'] },
  { title: 'Misc prep 1 hr', fields: ['bldg1', 'bldg2', 'bldg3', 'bldg4', 'total', 'rate/hour', 'finalTotal'] },
  { title: 'Powerwash', fields: ['bldg1', 'bldg2', 'bldg3', 'bldg4', 'total', 'rate/hour', 'finalTotal'] },
  { title: 'Hand wash (sq ft)', fields: ['bldg1', 'bldg2', 'bldg3', 'bldg4', 'total', 'rate/hour', 'finalTotal'] },
  { title: 'Hand wash (lin ft)', fields: ['bldg1', 'bldg2', 'bldg3', 'bldg4', 'total', 'rate/hour', 'finalTotal'] },
];

// Mapping function for collection names
// const collectionMap = {
//   'Prep': 'prepForms',
//   'Siding sq feet': 'sidingForms',
//   'Soffit lin. feet': 'soffitForms',
//   'Windows': 'windowsForms',
//   'Doors': 'doorsForms',
//   'Misc': 'miscForms',
//   'Special cons': 'specialConsForms',
//   'Railing': 'railingForms',
// };

// const getCollectionName = (label) => {
//   return collectionMap[label] || `${label.toLowerCase().replace(/\s+/g, '')}Forms`;
// };

const Prep = ({ navigation }) => {
  const route = useRoute();
  const { label, docId } = route.params || {};
  const [formData, setFormData] = useState({ projectName: '', jobContact: '', address: '', tasks: {}, images: [] });
  console.log("Form----Data---->", formData)
  const [isEditing, setIsEditing] = useState(!!docId);
  // const collectionName = getCollectionName(label); // Dynamic collection name


  useEffect(() => {
    if (docId) {
      const fetchData = async () => {
        try {
          const doc = await firestore().collection("formData").doc(docId).get();
          if (doc.exists) {
            setFormData(doc.data());
            console.log("Doc--data", doc.data())
          } else {
            Alert.alert('Error', 'Document not found!');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch data.');
        }
      };
      fetchData();
    }
  }, [docId], formData);

  const handleDropdownChange = (taskName, values) => {
    const total = ['bldg1', 'bldg2', 'bldg3', 'bldg4']
      .reduce((sum, key) => sum + (parseFloat(values[key]) || 0), 0);
    const ratePerHour = parseFloat(values['rate/hour']) || 0;
    const finalTotal = total * ratePerHour;

    setFormData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskName]: { ...values, total, finalTotal },
      },
    }));
  };

  const selectImages = () => {
    if (formData.images.length >= MAX_IMAGES) {
      Alert.alert('Limit Reached', 'You can upload up to 10 images.');
      return;
    }
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: MAX_IMAGES - formData.images.length },
      (response) => {
        if (!response.didCancel && response.assets) {
          const imageUris = response.assets.map((img) => img.uri);
          setFormData((prev) => ({ ...prev, images: [...prev.images, ...imageUris] }));
        }
      }
    );
  };

  // const handleSubmit = async () => {
  //   if (!formData.projectName || !formData.jobContact || !formData.address) {
  //     Alert.alert('Error', 'Please fill all required fields!');
  //     return;
  //   }
  //   try {
  //     if (isEditing) {
  //       await firestore().collection("formData").doc(docId).update({
  //         ...formData,
  //         updatedAt: firestore.FieldValue.serverTimestamp(),
  //       });
  //       Alert.alert('Success', 'Form data updated successfully!');
  //     } else {
  //       await firestore().collection("formData").add({
  //         ...formData,
  //         createdAt: firestore.FieldValue.serverTimestamp(),
  //         // profileDetails:{
  //         //   emailID:"",
  //         //  name:"",
  //         //  image:"",
  //         //  id:0
  //         // }
  //       });
  //       Alert.alert('Success', 'Form data saved successfully!');
  //     }
  //     navigation.goBack();
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to save/update data.');
  //   }
  // };

  const handleSubmit = async () => {
    if (!formData.projectName || !formData.jobContact || !formData.address) {
      Alert.alert('Error', 'Please fill all required fields!');
      return;
    }
    try {
      if (isEditing) {
        await firestore().collection("formData").doc(docId).update({
          ...formData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Form data updated successfully!',
          position: 'top', // Toast will appear at the top
        });
      } else {
        await firestore().collection("formData").add({
          ...formData,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Form data saved successfully!',
          position: 'top', 
        });
      }
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save/update data.',
        position: 'top',
      });
    }
  };



  const handleDelete = async () => {
    if (!isEditing) return;
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this form?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore().collection("formData").doc(docId).delete();
              Alert.alert('Success', 'Form deleted successfully!');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete data.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.gradient}>
        <HeaderComponent title={label} onBackPress={() => navigation.goBack()} headerStyle={styles.header} titleStyle={styles.headerTitle} />
        <ScrollView>
          <View style={{ flexDirection: 'row', marginVertical: 20 }}>
            <View style={styles.container}>
              <Text style={styles.projectNameHeading}>Project Name</Text>
              <TextInputComp
                placeholder="Project name"
                inputStyle={styles.inputPlaceholder}
                style={styles.textInputProjectName}
                value={formData.projectName}
                onChangeText={(text) => setFormData({ ...formData, projectName: text })}
              />
            </View>
            <View style={styles.container}>
              <Text style={styles.projectNameHeading}>Job Contact</Text>
              <TextInputComp
                placeholder="Job contact"
                inputStyle={styles.inputPlaceholder}
                style={styles.textInputProjectName}
                value={formData.jobContact}
                onChangeText={(text) => setFormData({ ...formData, jobContact: text })}
              />
            </View>
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>Address</Text>
            <TextInputComp
              placeholder="Address"
              inputStyle={styles.inputPlaceholder}
              style={styles.textInputAddress}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
          </View>
          <FlatList
            data={taskData}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <DropdownComp
                title={item.title}
                fields={item.fields}
                onValuesChange={handleDropdownChange}
                initialValues={formData.tasks[item.title]}
              // collectionName={collectionName} // Pass dynamic collection name to DropdownComp
              />
            )}
          />
          <Text style={styles.uploadImage}>Upload Images</Text>
          <View style={styles.imageUploadContainer}>
            <TouchableOpacity onPress={selectImages} style={styles.plusBtn}>
              <Image source={require('../../assets/images/add.png')} style={styles.addIcon} />
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
              {formData.images.map((img, index) => (
                <Image key={index} source={{ uri: img }} style={styles.uploadedImage} />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
        <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginBottom: 20 }}>
          <GlobalButtonComp
            title={isEditing ? 'Update' : 'Save & Add Other'}
            onPress={handleSubmit}
            style={styles.btn}
          />
          {isEditing && (
            <GlobalButtonComp
              title="Delete"
              onPress={handleDelete}
              style={[styles.btn, { backgroundColor: '#26525A', }]}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Prep;


const styles = StyleSheet.create({
  safeAreaViewContainer: { flex: 1, width: width },
  gradient: { flex: 1 },
  inputPlaceholder: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 18,
    color: '#535c60'
  },
  uploadImage: { fontSize: 10, color: '#FFFFFF', paddingHorizontal: 20, marginTop: 10 },
  imageUploadContainer: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  plusBtn: { borderRadius: 10, width: 55, height: 55, justifyContent: 'center', alignItems: 'center', backgroundColor: '#D9D9D9' },
  addIcon: { width: 20, height: 20 },
  imageContainer: { flexDirection: 'row', },
  uploadedImage: { width: 55, height: 55, borderRadius: 8, marginLeft: 8 },
  btn: { width: width * 0.88, backgroundColor: '#26525A', borderRadius: 20, alignSelf: 'center', marginBottom: 20 },

  headerTitle: {
    fontFamily: "Montserrat-Medium",
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 40,
    color: "#FFFFFF",
  },
  headingTask: {
    padding: 23,
  },
  headingTaskText: {
    fontFamily: "Montserrat-Medium",
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  textInputProjectName: {
    width: width * 0.4,
    height: height * 0.042,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 10,
  },
  projectNameHeading: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '500',
    fontSize: 10,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  inputPlaceholder: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '400',
    fontSize: 9,
    lineHeight: 18,
    color: '#535c60'
  },
  container: {
    paddingHorizontal: 20,
    marginBottom: -10
    // width:width*.4
  },
  address: {
    fontFamily: "Montserrat-Regular",
    fontWeight: '500',
    fontSize: 10,
    color: '#FFFFFF',
    paddingHorizontal: 24,
    marginVertical: 8,
  },
  addressContainer: {
    marginBottom: 10
  },
  textInputAddress: {
    width: width * 0.9,
    height: height * 0.042,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
});