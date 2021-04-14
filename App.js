/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import DrawerMenu from './src/Components/DrawerMenu';
import Statistics from './src/Screens/StatisticScreen';
import Notification from './src/drawer/NotificationScreen';
import Setting from './src/drawer/SettingScreen';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './src/Screens/SplashScreen';
import LaddingScreen from './src/Screens/LaddingScreen';
import LoginSplash from './src/Screens/LoginSplash';
import LoginScreen from './src/Screens/LoginScreen';
import OnboardingScreen from './src/Screens/OnboardingScreen';
import SignUpScreen from './src/Screens/SignUpScreen';
import FriendsList from './src/drawer/FriendListScreen';
import Search from './src/drawer/SearchScreen';
import Running from './src/Screens/RunScreen';
import EndActivityScreen from './src/Screens/EndActivityScreen';
import Loader from './src/Components/Loader';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import SearchScreen from './src/Screens/SearchScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerHome() {
  return (
    <>
      <Drawer.Navigator drawerContent={props => <DrawerMenu {...props} />}>
        <Drawer.Screen name="HomeDrawer" component={AppNavigation} />
        <Drawer.Screen name="Notification" component={Notification} />
        <Drawer.Screen name="FriendsList" component={FriendsList} />
        <Drawer.Screen name="Search" component={Search} />
        <Drawer.Screen name="Setting" component={Setting} />
        <Drawer.Screen name="Running" component={Running} />
        <Drawer.Screen name="EndActivity" component={EndActivityScreen} />
      </Drawer.Navigator>
    </>
  );
}

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '808513357172-okjgdvlj5ir57dinn624uij7n9jjeb8p.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true,
    });
  });
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen" headerMode="none">
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="DrawerHome" component={DrawerHome} />
          <Stack.Screen name="LaddingScreen" component={LaddingScreen} />
          <Stack.Screen name="LoginSplash" component={LoginSplash} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="Loader" component={Loader} />
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
