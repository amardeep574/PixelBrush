import { SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
// import customFonts from '../../theme/customFonts'
import TextInputComp from '../../components/textinputcomp/TextInputComp'
import GlobalButtonComp from '../../components/button_component/GlobalButtonComp'

const { height, width } = Dimensions.get('screen')

const ForgotPassword = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        let newErrors = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;

        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!emailRegex.test(email)) newErrors.email = 'Invalid email format or domain';

        // if (!password.trim()) newErrors.password = 'Password is required';
        // else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = () => {
        if (validate()) {
            console.log('Form submitted:', { email });
            navigation.navigate('SignIn')
            // Proceed with authentication logic here
        }
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.gradient}>
                <View style={styles.container}>
                    <Text style={styles.headingForgotPassword}>Forgot Password</Text>
                    <Text style={styles.subHeading}>Enter your email address and will sent you the instructions on how to change your password</Text>
                </View>

                <View style={styles.emialContainer}>
                    <Text style={styles.email}>E-mail</Text>
                    <TextInputComp
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.textInputBox}
                        inputStyle={styles.placeholderTextStyle}
                        placeholderTextColor="#535C60"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>
                <GlobalButtonComp title="Submit" style={styles.btn} textStyle={styles.submitBtntText} onPress={handleSubmit} />
                <View style={styles.alreadyAccountStyle}>
                    <Text onPress={() => navigation.navigate('SignIn')} style={styles.alreadyAccountStyleText}>Back to Login</Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingForgotPassword: {
        fontFamily: "Montserrat-Bold",
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 40,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 15
    },
    subHeading: {
        fontFamily: "Montserrat-Regular",
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 18,
        color: '#FFFFFF',
        paddingHorizontal: 85,
        width: width,
        textAlign: 'center'
    },
    emialContainer: {
        // width: width,
        padding: 40,
        paddingHorizontal: 60,
    },
    textInputBox: {
        height: height * 0.045,
        width: width * .78,
        marginVertical: 10,
        borderRadius: 10,
    },
    email: {
        fontFamily: "Montserrat-Regular",
        fontWeight:'500',
        fontSize: 14,
        lineHeight: 18,
        color: '#FFFFFF',
    },
    btn: {
        width: width * 0.78,
        backgroundColor: '#26525A',
        borderRadius: 20,
        marginBottom: 20
    },
    submitBtntText: {
        fontFamily: "Montserrat-Bold",
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 18,
        color: '#FFFFFF'
    },
    alreadyAccountStyle: {
        flexDirection: 'row',
        gap: 3,
        position: 'absolute',
        bottom: 22,
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 18
    },
    alreadyAccountStyleText: {
        // textDecorationLine: 'underline',
        fontFamily: "Montserrat-Regular",
        fontWeight: '500',
        color: '#234B52',
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 18,
    },
    placeholderTextStyle: {
        fontFamily: "Montserrat-Regular",
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 18,
        color: '#535C60'
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
    },
})