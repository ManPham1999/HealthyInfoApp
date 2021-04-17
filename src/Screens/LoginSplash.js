import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';

const LoginSplash = ({navigation}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [gettingLoginStatus, setGettingLoginStatus] = useState(true);

  const _signIn = async () => {
    // It will prompt google Signin Widget
    try {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      if (userInfo) {
        console.log('User Info --> ', userInfo);
        console.log('calling api...');
        await Axios({
          method: 'post',
          url: 'https://capstoneprojectk23.herokuapp.com/api/user/login',
          headers: {
            Accept: 'application/json; charset=utf-8',
            'Content-Type': 'application/json',
          },
          data: {
            userName: userInfo.user.name,
            email: userInfo.user.email,
            avatar: userInfo.user.photo,
          },
        })
          .then(res => {
            console.log(res.data.token);
            storeData(res.data.token);
            if (res.data.token !== undefined) {
              navigation.navigate('DrawerHome');
            }
          })
          .catch(err => {
            console.log('error: ', err);
          });
      }
    } catch (error) {
      console.log('Message', JSON.stringify(error));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Play Services Not Available or Outdated');
      } else {
        alert(error.message);
      }
    }
  };

  const _signOut = async () => {
    setGettingLoginStatus(true);
    // Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // Removing user Info
      setUserInfo(null);
    } catch (error) {
      console.error(error);
    }
    setGettingLoginStatus(false);
  };

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('token', jsonValue, error => {
        if (error) {
          console.log(error);
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  };
  console.log('loginsplash rendered');
  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.container}>
        <ImageBackground
          style={styles.imageLadding}
          resizeMode="cover"
          source={require('../assets/imagebg.jpg')}
          imageStyle={{backgroundColor: '#000', opacity: 0.8}}>
          <View style={styles.header}>
            <Animatable.Image
              animation="bounceIn"
              duration={1500}
              style={styles.logo}
              source={require('../assets/healthinfo.png')}
            />
          </View>
          <Animatable.View style={styles.footer} animation="fadeInUpBig">
            <View style={styles.line}></View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: 30,
                  marginHorizontal: 20,
                }}>
                <Text style={styles.title}>Log in or Sign up</Text>
                <Text style={styles.desc}>
                  Welcome to Health Info. First thing first
                </Text>
                <Text style={styles.desc}>
                  log in or sign up so that we can begin.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.buttonGoogle}
                activeOpacity={0.9}
                onPress={() => _signIn()}>
                <Image
                  style={styles.iconGoolge}
                  source={require('../assets/google.png')}
                />
                <Text style={styles.textGoogle}>Continue with Goolge</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('LoginScreen')}>
                      <View style={styles.buttonLogin}>
                          <Text style={styles.textLogin}>Sign In</Text>
                      </View>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('SignUpScreen')}>
                      <View style={styles.buttonSignUp}>
                          <Text style={styles.textSignUp}>Sign Up</Text>
                      </View>
                  </TouchableOpacity> */}
            </ScrollView>
          </Animatable.View>
        </ImageBackground>
      </View>
    </>
  );
};
export default LoginSplash;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  imageLadding: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    resizeMode: 'cover',
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    top: -40,
  },
  header: {
    flex: 1,
  },
  footer: {
    flex: 0.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  line: {
    borderWidth: 3,
    borderColor: '#D3D3D3',
    width: 40,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: -10,
  },
  title: {
    fontSize: 23,
    color: '#233249',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
  },
  desc: {
    fontSize: 17,
    color: '#9EA1A7',
    textAlign: 'center',
  },
  textGoogle: {
    color: '#233249',
    fontSize: 18,
    textAlign: 'center',
    left: 10,
  },
  buttonGoogle: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
    marginBottom: 10,
  },
  buttonLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#252427',
    borderRadius: 10,
    height: 55,
    marginHorizontal: 20,
    marginTop: 10,
  },
  textLogin: {
    color: '#233249',
    fontSize: 18,
    textAlign: 'center',
  },
  iconGoolge: {
    width: 16,
    height: 15.73,
  },
  buttonSignUp: {
    backgroundColor: '#252427',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
  },
  textSignUp: {
    color: '#fff',
    fontSize: 18,
  },
});
