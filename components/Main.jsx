import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './Pages/HomeScreen';
import Profile from './Pages/Profile';
import Activities from './Pages/Activities';


import { useDispatch, useSelector } from "react-redux";
import { FAB } from 'react-native-paper'


const Tab = createBottomTabNavigator();

export default function App() {

  const logInData = useSelector((state) => state.loginReducer);

  return (

    <NavigationContainer independent>
      <Tab.Navigator
        initialRouteName={logInData.user[0].new === true ? "Profile" : "Home"}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'home-outline'
                : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person-circle-outline' : 'person-circle-outline';
            }
            else if (route.name === 'Activities') {
              iconName = focused ? 'bookmark-outline' : 'bookmark-outline';
            }
            else if (route.name === 'About') {
              iconName = focused ? 'information-circle-outline' : 'information-circle-outline';
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#16a085',
          tabBarInactiveTintColor: '#34495e',
          // headerShown:false,
          tabBarStyle: {
            height: 60,
            position: 'absolute',
<<<<<<< Updated upstream
            bottom: 16,
            right: 16,
            left: 16,
            borderRadius: 10,
=======
            padding: 10,
>>>>>>> Stashed changes
          },
          headerStyle: {
            backgroundColor: '#fff',
          }


        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Activities" component={Activities} />
        <Tab.Screen name="Profile" component={Profile} />
        {/* <Tab.Screen name="About" component={About} /> */}
      </Tab.Navigator>
      {/* 
      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 100,
        }}
        large
        icon="plus"
        onPress={() => console.log('Pressed')}
      /> */}
    </NavigationContainer>
  );
}