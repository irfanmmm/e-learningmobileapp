import {View, Text, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import Otp from './components/screens/Otp';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PhoneOtpSample from './components/screens/PhoneOtpSample';
import Password from './components/screens/Password';
import Name from './components/screens/Name';
import Home from './components/screens/Home';
import TodaysLucturer from './components/screens/TodaysLucturer';
import Vide from './components/screens/Vide';
import Lessons from './components/screens/Lessons';
import Profile from './components/screens/Profile';
import MiddleActive from './src/Assets/class-dark.svg';
import Middle from './src/Assets/class-light.svg';
import HomeActive from './src/Assets/homeb.svg';
import HomeIcone from './src/Assets/homeg.svg';
import ProfleActive from './src/Assets/profileactive.svg';
import Profle from './src/Assets/profile.svg';
import Completed from './components/screens/tabs/Completed';
import Luc from './components/screens/tabs/Luc';
import Ongoing from './components/screens/tabs/Ongoing';
import Lucturer from './components/screens/Lucturer';
import Cources from './components/screens/Cources';


export default function App({ navigation }) {
  const Tab = createBottomTabNavigator();
  const HomeStack = createNativeStackNavigator();

  const HomeTabs = () => (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarLabel: () => null,
        tabBarInactiveTintColor: 'black',
        headerShown: false,

        tabBarIcon: ({focused, color, size}) => {
          if (route.name === 'Home') {
            return focused ? (
              <HomeActive width={30} height={30} />
            ) : (
              <HomeIcone width={30} height={30} />
            );
          } else if (route.name === 'TodaysLucturer') {
            return focused ? (
              <MiddleActive width={30} height={30} />
            ) : (
              <Middle width={30} height={30} />
            );
          } else if (route.name === 'Profile') {
            return focused ? (
              <ProfleActive width={30} height={30} />
            ) : (
              <Profle width={30} height={30} />
            );
          }
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="TodaysLucturer" component={TodaysLucturer} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );

 

  return (
    <>
      <NavigationContainer>
        <HomeStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <HomeStack.Screen name="PhoneOtpSample" component={PhoneOtpSample} />
          <HomeStack.Screen name="Otp" component={Otp} />
          <HomeStack.Screen name="Name" component={Name} />
          <HomeStack.Screen name="Password" component={Password} />
          <HomeStack.Screen name="Lessons" component={Lessons} />
          <HomeStack.Screen name="HomeTabs" component={HomeTabs} />
          <HomeStack.Screen name="Cources" component={Cources} />
          <HomeStack.Screen name="Vide" component={Vide} />

          {/* Tabs */}
        </HomeStack.Navigator>
      </NavigationContainer>
      {/* <PhoneOtpSample /> */}
      {/* <Otp /> */}
      {/* <Name/> */}
      {/* <Password/> */}
      {/* <Lessons/> */}

      {/* Tab Navigation */}
      {/* <Home/> */}
      {/* <TodaysLucturer/> */}
      {/* <Profile /> */}
    </>
  );
}
