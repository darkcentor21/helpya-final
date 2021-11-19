import * as React from 'react';
import { Text, View, SafeAreaProvider } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import combineReducer from './components/Reducers/combineReducer';
import Main from './components/Main'
import Login from './components/Login'

const Stack = createNativeStackNavigator()

const store = createStore(combineReducer)

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Main" component={Main} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
