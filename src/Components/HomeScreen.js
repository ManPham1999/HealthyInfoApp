import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MenuItem from './MenuItem';
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from 'jwt-decode';
import Loading from './Loading';
import GoogleFit, {Scopes} from 'react-native-google-fit';

const HomeScreen = ({navigation}) => {
  const [userInfor, setUserInfor] = useState({
    avatar: '',
    email: '',
    userName: '',
  });
  const [steps, setSteps] = useState([]);
  const [distance, setDistance] = useState([]);
  const [calories, setCalories] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('token');
        if (jsonValue != null) {
          const decoded = jwt_decode(JSON.parse(jsonValue));
          setUserInfor({
            avatar: decoded.payload.avatar,
            email: decoded.payload.email,
            userName: decoded.payload.userName,
          });
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    const onRequestToGoogle = async () => {
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_ACTIVITY_WRITE,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_BODY_WRITE,
          Scopes.FITNESS_LOCATION_READ,
          Scopes.FITNESS_LOCATION_WRITE,
        ],
      };
      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            console.log('AUTH_SUCCESS');
          } else {
            console.log(authResult.message);
          }
        })
        .then(res => {
          if (res) {
            GoogleFit.startRecording(callback => {
              console.log(callback);
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    };
    const getDataAndGoogleFitInfor = async () => {
      await onRequestToGoogle();
      await getData();
      // get steps
      await GoogleFit.getDailySteps(new Date())
        .then(async res => {
          await setSteps(res);
        })
        .catch();
      const opt = {
        startDate: '2020-11-01T00:00:17.971Z', // required
        endDate: new Date().toISOString(), // required
        bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
      };
      const optCalo = {
        startDate: '2020-11-01T00:00:17.971Z', // required
        endDate: new Date().toISOString(), // required
        basalCalculation: true, // optional, to calculate or not basalAVG over the week
        bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
      };
      // get distance
      await GoogleFit.getDailyDistanceSamples(opt).then(res => {
        setDistance(res);
      });
      //get calorie
      await GoogleFit.getDailyCalorieSamples(optCalo).then(res => {
        setCalories(res);
      });
    };
    getDataAndGoogleFitInfor();
  }, []);
  console.log('HomeScreen rendered');

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.custom}>
          <View style={styles.headerContainer}>
            <View>
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Image
                  style={styles.menu}
                  source={require('../assets/menu.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('Profile');
                }}>
                <Image
                  style={styles.profileImage}
                  source={
                    userInfor.avatar !== ''
                      ? {uri: userInfor.avatar}
                      : require('../assets/avatar.jpg')
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.refresh}>
            <View>
              <Text style={styles.title}>Activity</Text>
            </View>
          </View>
          <MenuItem
            steps={steps.length > 0 ? steps[2]?.steps[0]?.value : 100}
            calories={
              calories.length > 0 ? calories[calories.length - 1].calorie : 100
            }
            distance={
              distance.length > 0 ? distance[distance.length - 1].distance : 100
            }
          />
          {/* <Loading/> */}
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    backgroundColor: '#000',
  },
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  menu: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
  },
  custom: {
    backgroundColor: '#FFF',
    height: '100%',
    paddingBottom: 5,
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
  },
  refresh: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  iconRef: {
    backgroundColor: '#fff', //e52a2a
    padding: 5,
    borderRadius: 8,
  },
});
