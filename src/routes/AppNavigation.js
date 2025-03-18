import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
// import BottomTabNavigation from './BottomTabNavigation'
import SplashScreen from '../screens/splashscreen/SplashScreen'
import OnboardingScreen from '../screens/onboardingscreen/OnboardingScreen'
import SignIn from '../screens/auth/SignIn'
import SignUp from "../screens/auth/SignUp"
import ForgotPassword from '../screens/auth/ForgotPassword'
import Prep from '../screens/prep/Prep'
import PastworkHistory from '../screens/pastwork_history/PastworkHistory'
import HomeScreen from '../screens/homescreen/HomeScreen'
import ProfileScreen from '../screens/profilescreen/ProfileScreen'









const Stack = createStackNavigator() // Move this outside

const AppNavigation = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SplashScreen'> 
        <Stack.Screen name='SplashScreen' component={SplashScreen} options={{headerShown:false}}/>
        <Stack.Screen name='OnboardingScreen' component={OnboardingScreen} options={{headerShown:false}}/>
        {/* <Stack.Screen name="Main" component={BottomTabNavigation} options={{headerShown:false}} /> */}
        <Stack.Screen name='SignIn' component={SignIn} options={{headerShown:false}} />
        <Stack.Screen name='SignUp' component={SignUp} options={{headerShown:false}} />
        <Stack.Screen name='ForgotPassword' component={ForgotPassword} options={{headerShown:false}} />
        <Stack.Screen name='Prep' component={Prep}  options={{headerShown:false}}/>
        <Stack.Screen name='PastworkHistory' component={PastworkHistory} options={{headerShown:false}} />
        <Stack.Screen name='Home' component={HomeScreen} options={{headerShown:false}}  />
        <Stack.Screen name='Profile' component={ProfileScreen} options={{headerShown:false}} />
      
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation
