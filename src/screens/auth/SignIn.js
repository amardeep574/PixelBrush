

import {
    Dimensions, StyleSheet, Text, TouchableOpacity, View, SafeAreaView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import TextInputComp from '../../components/textinputcomp/TextInputComp';
import GlobalButtonComp from '../../components/button_component/GlobalButtonComp';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const { height, width } = Dimensions.get('screen');

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);



    const validate = () => {
        let newErrors = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;

        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!emailRegex.test(email)) newErrors.email = 'Invalid email format or domain';

        if (!password.trim()) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSignIn = async () => {
        if (validate()) {
            setLoading(true);
            try {
                const userCredential = await auth().signInWithEmailAndPassword(email, password);
                const user = userCredential.user;
    
                // Save user info in AsyncStorage
                await AsyncStorage.setItem('userInfo', JSON.stringify({ email: user.email, uid: user.uid }));
    
                Toast.show({
                    type: 'success',
                    text1: 'Sign-In Successful',
                    text2: 'Welcome back!',
                    position: 'top',
                    visibilityTime: 3000,
                });
    
                setTimeout(() => {
                    navigation.replace('Home'); // Navigate to Home screen
                }, 1000);
    
            } catch (error) {
                console.error('Error signing in:', error.message);
    
                Toast.show({
                    type: 'error',
                    text1: 'Sign-In Failed',
                    text2: error.message,
                    position: 'top',
                });
            } finally {
                setLoading(false);
            }
        }
    };
    

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.gradient}>
                <View style={[styles.container, { width: width }]}>
                    <Text style={styles.headingSignIn}>Sign In</Text>
                    <Text style={styles.subHeading}>Hi! Welcome back, you’ve been missed</Text>
                </View>

                <View style={styles.emailContainer}>
                    <Text style={styles.email}>E-mail</Text>
                    <TextInputComp
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.textInputBox}
                        placeholderTextColor="#535C60"
                        inputStyle={styles.inputPlaceholderStyle}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                    <Text style={styles.password}>Password</Text>
                    <TextInputComp
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.textInputBox}
                        inputStyle={styles.inputPlaceholderStyle}
                        placeholderTextColor="#535C60"
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordContainer}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <GlobalButtonComp
                    title={loading ? "Signing In..." : "Sign In"}
                    style={styles.btn}
                    textStyle={styles.signupTextStyle}
                    onPress={handleSignIn}
                    disabled={loading}
                />

                <View style={styles.alreadyAccountStyle}>
                    <Text style={styles.dontHaveAccount}>Don’t have an account?</Text>
                    <Text onPress={() => navigation.navigate('SignUp')} style={styles.alreadyAccountStyleText}>Sign Up</Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default SignIn;

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingSignIn: {
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
        fontSize: 15,
        lineHeight: 18,
        color: '#FFFFFF',
        paddingHorizontal: 50
    },
    emailContainer: {
        padding: 40,
        paddingHorizontal: 60,
    },
    email: {
        fontFamily: "Montserrat-Regular",
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 18,
        color: '#FFFFFF',
    },
    textInputBox: {
        height: height * 0.045,
        width: width * 0.82,
        marginVertical: 10,
        borderRadius: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    password: {
        fontFamily: "Montserrat-Regular",
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 18,
        color: '#FFFFFF',
    },
    forgotPasswordContainer: {
        width: width * 0.81,
    },
    forgotPasswordText: {
        fontFamily: "Montserrat-Regular",
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 18,
        color: '#234B52',
        textAlign: 'right',
        textDecorationLine: 'underline',
    },
    btn: {
        width: width * 0.80,
        backgroundColor: '#26525A',
        borderRadius: 20,
        marginBottom: 20
    },
    signupTextStyle: {
        fontFamily: "Montserrat-Regular",
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 18,
        color: '#FFFFFF'
    },
    alreadyAccountStyle: {
        flexDirection: 'row',
        gap: 3,
        position: 'absolute',
        bottom: 22,
    },
    alreadyAccountStyleText: {
        textDecorationLine: 'underline',
        fontFamily: "Montserrat-Medium",
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 18,
        color: '#234B52'
    },
    inputPlaceholderStyle: {
        fontFamily: "Montserrat-Regular",
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 18,
        color: '#535C60',
    },
    dontHaveAccount: {
        fontFamily: "Montserrat-Medium",
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 18,
        color: '#234B52'
    }
});


