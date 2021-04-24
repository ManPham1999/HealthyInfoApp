import React, {useCallback, useEffect, useState} from 'react';
import { io } from "socket.io-client";
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNLocation from 'react-native-location';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import Loading from '../Components/Loading';

const RunScreen = ({navigation, route}) => {
  useEffect(()=>{
    const socket = io("http://192.168.0.120:3000");
  },[]);
  const [position, setPosition] = useState([]);
  const [speeds, setSpeeds] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [unsubscribe, setUnsubscribe] = useState();
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
    var maxLocation = await onReturnMaxElementIndex(position);
    const dis = await calcCrow(
      position[0].latitude,
      position[0].longitude,
      maxLocation.latitude,
      maxLocation.longitude,
    ); //km
    return dis * 1000;
  };
  const resultAvgSpeed = async () => {
    var sum = 0;
    var avg = 0.0;
    for (var i = 0; i < speeds.length; i++) {
      sum += speeds[i];
    }
    avg = (await sum) / speeds.length;
    return avg;
  };
  useEffect(() => {
    RNLocation.requestPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse', // or 'fine'
        rationale: {
          title: 'We need to access your location',
          message: 'We use your location to show where you are on the map',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      },
    });
  }, []);
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
  const onSubLocation = async () => {
    console.log('subcribing...');
    const unsubscriber = await RNLocation.subscribeToLocationUpdates(
      async locations => {
        console.log(locations);
        await setPosition(prevArray => [
          ...prevArray,
          {latitude: locations[0].latitude, longitude: locations[0].longitude},
        ]);
        await setSpeeds(prevspeeds => [...prevspeeds, locations[0].speed]);
      },
    );
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
  };
  const onFinishExc = async () => {
    var distanceFinal = await resultDistance();
    var speedFinal = await resultAvgSpeed();
    await onResete(startTime, distanceFinal, speedFinal);
    await onUnSub();
    setSpeeds([]);
    setPosition([]);
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
                    key={index}
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}
                  />
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
                    Go
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
                    {position.length > 0
                      ? Math.round(
                          calcCrow(
                            position[0].latitude,
                            position[0].longitude,
                            position[position.length - 1].latitude,
                            position[position.length - 1].longitude,
                          ) * 1000,
                        )
                      : 0}
                    <Text style={{fontSize: 10, fontWeight: '700'}}>M</Text>
                  </Text>
                </View>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  <Text style={{color: '#000', fontSize: 15}}>Speed</Text>
                  <Text style={styles.textInfo}>
                    {speeds.length > 0
                      ? Math.ceil(speeds[speeds.length - 1])
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
});
