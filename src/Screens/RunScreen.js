import React, {useCallback, useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import {
  Button,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import jwt_decode from 'jwt-decode';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNLocation from 'react-native-location';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Loading from '../Components/Loading';
const socket = io('https://capstoneprojectk23.herokuapp.com/');
var randomColor = Math.floor(Math.random() * 16777215).toString(16);

const RunScreen = ({navigation, route}) => {
  const [position, setPosition] = useState([]);
  const [speeds, setSpeeds] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [unsubscribe, setUnsubscribe] = useState();
  const [userInformation, setUserInformation] = useState(null);
  let filteredPositon = position.filter(p => p.userId === userInformation.id);
  let filteredSpeeds = speeds.filter(p => p.userId === userInformation.id);
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('token');
      if (jsonValue != null) {
        const decoded = jwt_decode(JSON.parse(jsonValue));
        setUserInformation({
          avatar: decoded.payload.avatar,
          email: decoded.payload.email,
          userName: decoded.payload.userName,
          id: decoded.payload.id,
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const onUnSub = () => {
    unsubscribe.unsub();
  };

  const onReturnMaxElementIndex = positionArr => {
    var max = positionArr[0];
    for (let i = 0; i < positionArr.length; i++) {
      const element = positionArr[i];
      if (
        calcCrow(
          max.latitude,
          max.longitude,
          element.latitude,
          element.longitude,
        ) > 0
      ) {
        max = element;
      }
    }
    return max;
  };
  const resultDistance = async () => {
    var maxLocation = await onReturnMaxElementIndex(filteredPositon);
    const dis = await calcCrow(
      filteredPositon[0].latitude,
      filteredPositon[0].longitude,
      maxLocation.latitude,
      maxLocation.longitude,
    ); //km
    return dis * 1000;
  };
  const resultAvgSpeed = async () => {
    var sum = 0;
    var avg = 0.0;
    for (var i = 0; i < filteredSpeeds.length; i++) {
      sum += filteredSpeeds[i]?.speed;
    }
    avg = (await sum) / filteredSpeeds.length;
    return avg;
  };
  useEffect(() => {
    RNLocation.configure({
      distanceFilter: 0.5, // Meters
      desiredAccuracy: {
        ios: 'best',
        android: 'balancedPowerAccuracy',
      },
      // Android only
      androidProvider: 'auto',
      interval: 5000, // Milliseconds
      fastestInterval: 10000, // Milliseconds
      maxWaitTime: 5000, // Milliseconds
    });
  }, []);
  const onSubLocation = () => {
    const unsubscriber = RNLocation.subscribeToLocationUpdates(locations => {
      socket.emit('chat message', {
        ...locations,
        userId: userInformation?.id,
        userName: userInformation?.userName,
        color: `#${randomColor}`,
      });
      socket.on('chat message', function (msg) {
        setPosition(prevArray => [
          ...prevArray,
          {
            latitude: msg[0].latitude,
            longitude: msg[0].longitude,
            userId: msg?.userId,
            userName: msg?.userName,
            color: msg?.color,
          },
        ]);
        setSpeeds(prevspeeds => [
          ...prevspeeds,
          {speed: msg[0].speed, userId: msg?.userId},
        ]);
      });
    });
    setUnsubscribe({unsub: unsubscriber});
  };
  //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
  function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  function toRad(Value) {
    return (Value * Math.PI) / 180;
  }
  const onResete = async (timeFinal, distanceFinal, speedFinal) => {
    console.log('timeFinal: ', timeFinal);
    await navigation.navigate('EndActivity', {
      time: `${timeFinal}`,
      totalmet: distanceFinal,
      avgSpeed: speedFinal,
    });
    await setSpeeds([]);
    filteredPositon = [];
    filteredSpeeds = [];
    await setPosition([]);
  };
  const onFinishExc = async () => {
    var distanceFinal = await resultDistance();
    var speedFinal = await resultAvgSpeed();
    await onResete(startTime, distanceFinal, speedFinal);
    await onUnSub();
  };
  const onStartProgram = async () => {
    setStartTime(prev => (prev = new Date()));
    await onSubLocation();
  };
  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.ladding}>
          <View style={styles.headerContainer}>
            {position.length > 0 ? (
              <MapView
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: position[0].latitude,
                  longitude: position[0].longitude,
                  latitudeDelta: 0.0041,
                  longitudeDelta: 0.0021,
                }}
                style={styles.ladding}>
                {position.map((item, index) => (
                  <Marker
                    title={item.userName}
                    key={index}
                    pinColor={item.color}
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}></Marker>
                ))}
              </MapView>
            ) : (
              <Loading />
            )}
          </View>
          <Animatable.View style={styles.footer} animation="fadeInUpBig">
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <View style={styles.buttonRun}>
                <TouchableOpacity
                  style={styles.iconOval}
                  activeOpacity={0.5}
                  onPress={() => navigation.goBack()}>
                  <Ionicons name="md-chevron-back" color="#000" size={30} />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[styles.iconGo]}
                  onPress={() => onStartProgram()}>
                  <Text
                    style={{fontSize: 22, color: '#000', fontWeight: '700'}}>
                    Start
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => onFinishExc()}
                  style={[styles.iconOval2, {backgroundColor: '#000'}]}>
                  <Ionicons name="stop" size={30} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.infoRunning}>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  <Text style={{color: '#000', fontSize: 15}}>Distance</Text>
                  <Text style={styles.textInfo}>
                    {filteredPositon.length > 0
                      ? Math.round(
                          calcCrow(
                            filteredPositon[0].latitude,
                            filteredPositon[0].longitude,
                            filteredPositon[filteredPositon.length - 1]
                              .latitude,
                            filteredPositon[filteredPositon.length - 1]
                              .longitude,
                          ) * 1000,
                        )
                      : 0}
                    <Text style={{fontSize: 10, fontWeight: '700'}}>M</Text>
                  </Text>
                </View>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  <Text style={{color: '#000', fontSize: 15}}>Speed</Text>
                  <Text style={styles.textInfo}>
                    {filteredPositon.length > 0
                      ? Math.ceil(
                          filteredSpeeds[filteredSpeeds.length - 1]?.speed,
                        )
                      : 0}
                    <Text style={{fontSize: 10, fontWeight: '700'}}>m/s</Text>
                  </Text>
                </View>
              </View>
            </ScrollView>
          </Animatable.View>
        </View>
      </SafeAreaView>
    </>
  );
};
export default RunScreen;
const options = {
  container: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    width: 220,
  },
  text: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: 7,
  },
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  ladding: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  footer: {
    flex: 0.4,
    backgroundColor: '#ff9d15', //"#44CAAC"
    borderTopLeftRadius: 35,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonRun: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  iconOval: {
    backgroundColor: '#e48c12',
    padding: 12,
    borderRadius: 120,
  },
  iconOval2: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 120,
  },
  iconGo: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 100,
    top: -20,
    // borderWidth: 3
  },
  line: {
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  distance: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  infoRunning: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  textInfo: {
    color: '#000',
    fontWeight: '700',
    fontSize: 22,
  },
  counterText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 30,
  },
  icon: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    padding: 12,
    borderRadius: 120,
  },
});
