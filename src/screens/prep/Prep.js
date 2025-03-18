import { SafeAreaView, StyleSheet, Text, View, Dimensions, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import HeaderComponent from '../../components/headercomponent/HeaderComponent';
// import customFonts from '../../theme/customFonts';
import TextInputComp from '../../components/textinputcomp/TextInputComp';
import DropdownComp from '../../components/dropdown/DropdownComp';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import GlobalButtonComp from '../../components/button_component/GlobalButtonComp';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { height, width } = Dimensions.get('screen');
const MAX_IMAGES = 10;
const taskData = [
    { title: 'Area Sand (sq ft)', fields: ['bldg1', 'bldg2', 'bldg3', 'bldg4', 'total', 'rate/hour', "total"] },
    { title: 'Caulk (lin ft)', fields: ['bldg1', 'bldg2', 'bldg3', 'bldg4', 'total', 'rate/hour', "total"] },
    { title: 'Misc prep 1 hr', fields: ['bldg1', 'bldg2', 'bldg3', 'bldg4', 'total', 'rate/hour', "total"] },
    { title: 'Powerwash', fields: ['bldg1', 'bldg2', 'bldg3', 'bldg4', 'total', 'rate/hour', "total"] },
    { title: 'Hand wash (sq ft)', fields: ['bldg1', 'bldg2', 'bldg3', 'bldg4', 'total', 'rate/hour', "total"] },
    { title: 'Hand wash (lin ft)', fields: ['bldg1', 'bldg2', 'bldg3', 'bldg4', 'total', 'rate/hour', "total"] },
];

const Prep = () => {
    const navigation = useNavigation()
    const { params } = useRoute()
    // console.log("params---->",params)
    const [images, setImages] = useState([]);

    const selectImages = () => {
        // if(images.length >= 10){
        //     alert("You can only select up to 10 images.");
        //     return;
        // }
        // launchImageLibrary(
        //     { mediaType: 'photo', selectionLimit: 10 },
        //     (response) => {
        //         if (response.didCancel) return;
        //         if (response.assets) {
        //             setImages([...images, ...response.assets.slice(0, 10 - images.length)]);
        //         }
        //     }
        // );
        if (images.length >= MAX_IMAGES) return;

        launchImageLibrary(
            { mediaType: 'photo', selectionLimit: MAX_IMAGES - images.length },
            (response) => {
                if (response.didCancel) return;
                if (response.assets) {
                    setImages([...images, ...response.assets.slice(0, MAX_IMAGES - images.length)]);
                }
            }
        );
    };
    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    return (
        <SafeAreaView style={styles.safeAreaViewContainer}>
            <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.gradient}>
                <HeaderComponent title={params.label} onBackPress={() => navigation.goBack()} headerStyle={styles.header} titleStyle={styles.headerTitle} />
                <ScrollView>
                    <View style={styles.headingTask}>
                        <Text style={styles.headingTaskText}>List of all available Tasks</Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.container}>
                            <Text style={styles.projectNameHeading}>Project Name</Text>
                            <TextInputComp placeholder="Project name" style={styles.textInputProjectName} inputStyle={styles.inputPlaceholder} />
                        </View>

                        <View style={styles.container}>
                            <Text style={styles.projectNameHeading}>Job Contact</Text>
                            <TextInputComp placeholder="Job contact" style={styles.textInputProjectName} inputStyle={styles.inputPlaceholder} />
                        </View>
                    </View>

                    <View style={styles.addressContainer}>
                        <Text style={styles.address}>Address</Text>
                        <TextInputComp placeholder="Address" style={styles.textInputAddress} inputStyle={styles.inputPlaceholder} />
                    </View>

                    {/* Dropdown List */}
                    <View>
                        <FlatList
                            data={taskData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => <DropdownComp title={item.title} fields={item.fields} />}
                            contentContainerStyle={styles.dropdownList}

                        />
                        <Text style={styles.uploadImage}>Upload Image</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={selectImages}>
                                <View style={[styles.plusBtn, { marginHorizontal: 20, marginVertical: 14 }]}>
                                    <Image source={require('../../assets/images/add.png')} style={{ width: 20, height: 20 }} />
                                </View>
                                {/* Display First Selected Image */}
                                {/* {images.length > 0 && (
                        <Image source={{ uri: images[0].uri }} style={styles.uploadedImage} />
                        )} */}
                            </TouchableOpacity>
                            {/* Display All Selected Images in ScrollView */}
                            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
                                {images.map((img, index) => (
                                    <Image key={index} source={{ uri: img.uri }} style={styles.uploadedImage} />
                                ))}
                            </ScrollView> */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
                                {images.map((img, index) => (
                                    <View key={index} style={styles.imageWrapper}>
                                        <Image source={{ uri: img.uri }} style={styles.uploadedImage} />
                                        {/* <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                                        <Icon name="close" size={16} color="white" />
                                    </TouchableOpacity> */}
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                    </View>
                </ScrollView>
                {/* <View style={{  flex: 1,marginBottom:20,}}> */}
                <GlobalButtonComp title="Save & Add Other" style={styles.btn} textStyle={styles.submitBtntText}
                //    onPress={handleSubmit} 
                />
                {/* </View> */}
                <View style={{ paddingBottom: 20 }} />

            </LinearGradient>
        </SafeAreaView>
    );
};

export default Prep;

const styles = StyleSheet.create({
    safeAreaViewContainer: {
        flex: 1,
        width: width,
    },
    gradient: {
        flex: 1,
    },
    header: {
        backgroundColor: '#152D32',
    },
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
        fontSize: 8,
        lineHeight: 18,
        color: '#535c60'
    },
    container: {
        paddingHorizontal: 20,
        marginBottom: 10,
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
    textInputAddress: {
        width: width * 0.9,
        height: height * 0.042,
        borderRadius: 8,
        backgroundColor: '#D9D9D9',
        alignSelf: 'center',
        paddingHorizontal: 10,
    },
    dropdownList: {
        padding: 5,
    },
    plusBtn: {
        // borderWidth:1,
        borderRadius: 10,
        width: width * .13,
        height: height * .06,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9D9D9'

    },
    uploadImage: {
        fontFamily: "Montserrat-Regular",
        fontWeight: '500',
        fontSize: 10,
        lineHeight: 18,
        color: '#FFFFFF',
        paddingHorizontal: 20
    },
    imageContainer: {
        flexDirection: 'row',
        paddingHorizontal: 0,
        flexWrap: 'wrap',
    },
    uploadedImage: {
        width: 55,
        height: 55,
        borderRadius: 8,
        marginLeft: 10, // Space between button and image
    },
    btn: {
        width: width * 0.88,
        backgroundColor: '#26525A',
        borderRadius: 20,
        alignSelf: 'center',

    },
    submitBtntText: {
        fontFamily: "Montserrat-Bold",
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 18,
        color: '#FFFFFF'
    },
    removeImageBtn: { position: 'absolute', top: -0, right: -0, borderRadius: 10, padding: 2 }
});

