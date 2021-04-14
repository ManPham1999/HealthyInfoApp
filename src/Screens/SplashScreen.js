import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect} from 'react';
import {Image, StatusBar, StyleSheet, View} from 'react-native';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('token');
        if (jsonValue !== null) {
          setTimeout(() => {
            navigation.replace('DrawerHome');
          }, 2000);
        } else {
          setTimeout(() => {
            navigation.replace('LaddingScreen');
          }, 2000);
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    getData();
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.container}>
        <Image
          style={styles.logo}
          resizeMode="stretch"
          source={require('../assets/unsplash.png')}
        />
      </View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
});
