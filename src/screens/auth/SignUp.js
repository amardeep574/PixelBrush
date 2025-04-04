
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextInputComp from '../../components/textinputcomp/TextInputComp';
import GlobalButtonComp from '../../components/button_component/GlobalButtonComp';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; // Added missing import
import Toast from 'react-native-toast-message';

const { height, width } = Dimensions.get('screen');

const SignUp = ({ navigation }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // Added loading state

    const validate = () => {
        let newErrors = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;

        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!emailRegex.test(email)) newErrors.email = 'Invalid email format or domain';
        if (!password.trim()) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!isChecked) newErrors.terms = 'You must agree to the terms';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            await user.updateProfile({ displayName: name });
            await firestore().collection('users').doc(user.uid).set({
                name: name,
                email: user.email,
                profileImage: null,
                createdAt: firestore.FieldValue.serverTimestamp()
            });

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Sign-Up Successful'
            });
            navigation.navigate('SignIn');
        } catch (error) {
            let errorMessage = 'An error occurred during signup';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered. Please use a different email or sign in.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak. Please use a stronger password';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password accounts are not enabled';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            Toast.show({
                type: 'error',
                text1: 'Signup Failed',
                text2: errorMessage
            });
            console.error('Error signing up:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient colors={['#26525A', '#B4C6D0']} style={styles.gradient}>
                <View style={styles.container}>
                    <Text style={styles.headingSignUp}>Sign Up</Text>
                    <Text style={styles.subHeading}>Fill your information below</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInputComp
                        placeholder="Enter your name"
                        style={styles.textInputBox}
                        placeholderTextColor="#535C60"
                        value={name}
                        onChangeText={setName}
                        editable={!isLoading}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                    <Text style={styles.label}>E-mail</Text>
                    <TextInputComp
                        placeholder="Enter your email"
                        style={styles.textInputBox}
                        placeholderTextColor="#535C60"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isLoading}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                    <Text style={styles.label}>Password</Text>
                    <TextInputComp
                        placeholder="Enter your password"
                        secureTextEntry={!showPassword}
                        style={styles.textInputBox}
                        placeholderTextColor="#535C60"
                        value={password}
                        onChangeText={setPassword}
                        icon={showPassword ? 'visibility-off' : 'visibility'}
                        onIconPress={() => setShowPassword(!showPassword)}
                        editable={!isLoading}
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setIsChecked(!isChecked)}
                        disabled={isLoading}
                    >
                        <Icon
                            name={isChecked ? 'check-box' : 'check-box-outline-blank'}
                            size={24}
                            color="#26525A"
                        />
                        <Text style={styles.termsText}>
                            I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text>
                        </Text>
                    </TouchableOpacity>
                    {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
                </View>

                <GlobalButtonComp
                    title="Sign up"
                    style={styles.btn}
                    textStyle={styles.signupTextStyle}
                    onPress={handleSubmit}
                    disabled={isLoading}
                    loading={isLoading} // Assuming your button component supports this
                />

                <View style={styles.alreadyAccountStyle}>
                    <Text style={styles.haveAccount}>Already have an account?</Text>
                    <Text 
                        onPress={() => !isLoading && navigation.navigate('SignIn')} 
                        style={styles.alreadyAccountStyleText}
                    >
                        Sign In
                    </Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default SignUp;

// Styles remain the same as in your original code

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingSignUp: {
        fontWeight: '600',
        fontFamily: "Montserrat-Bold",
        fontSize: 24,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 15,
    },
    subHeading: {
        fontWeight: '500',
        fontSize: 14,
        color: '#FFFFFF',
    },
    inputContainer: {
        padding: 40,
        paddingHorizontal: 60,
    },
    label: {
        fontWeight: '500',
        fontFamily:"Montserrat-Regular",
        fontSize: 14,
        color: '#FFFFFF',
        marginVertical: 8
    },
    textInputBox: {
        height: height * 0.045,
        width: width * 0.80,
        marginVertical: 10,
        borderRadius: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    termsText: {
        fontSize: 12,
        color: '#535c68',
        marginLeft: 8,
    },
    termsLink: {
        fontWeight: '600',
        textDecorationLine: 'underline',
        color: '#26525A',
    },
    btn: {
        width: width * 0.80,
        backgroundColor: '#26525A',
        borderRadius: 20,
        marginBottom: 20,
    },
    signupTextStyle: {
        fontWeight: '600',
        fontSize: 14,
        color: '#FFFFFF'
    },
    alreadyAccountStyle: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 22,
    },
    alreadyAccountStyleText: {
        textDecorationLine: 'underline',
        fontWeight: '600',
        color: '#234B52'
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    }
});
