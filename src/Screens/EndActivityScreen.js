import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from 'jwt-decode';
import Axios from 'axios';

const EndActivityScreen = ({navigation, route}) => {
  const [userInfor, setUserInfor] = useState({
    id: '',
    avatar: '',
    email: '',
    userName: '',
  });
  const {avgSpeed, totalmet, time} = route.params;
  var resultTime = new Date(time);
  var today = new Date();
  var diffMs = today - resultTime;
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
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
            id: decoded.payload.id,
          });
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    const opt = {
      startDate: '2017-01-01T00:00:17.971Z', // required
      endDate: new Date().toISOString(), // required
    };
    const opt2 = {
      unit: 'kg', // required; default 'kg'
      startDate: '2017-01-01T00:00:17.971Z', // required
      endDate: new Date().toISOString(), // required
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
      ascending: false, // optional; default false
    };
    getData();
    GoogleFit.getWeightSamples(opt2, (isError, result) => {
      if (isError) {
        console.log('get weight error!');
      }
      setWeight(result[0].value);
    });
    GoogleFit.getHeightSamples(opt, (isError, result) => {
      if (isError) {
        console.log('get height error!');
      }
      setHeight(result[0].value);
    });
  }, []);
  const onInsertHistory = async () => {
    var calo = Math.round(
      0.035 * weight +
        ((avgSpeed * avgSpeed) / (height / 100)) * 0.029 * weight,
    );
    await Axios({
      method: 'post',
      url: `https://capstoneprojectk23.herokuapp.com/api/user/addReport/${userInfor.id}`,
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
      },
      data: {
        time: diffMins,
        distance: totalmet,
        calories: calo,
        avgSpeed: avgSpeed,
      },
    })
      .then((res) => {
        if (res.data) {
          navigation.navigate('HomeDrawer');
        }
      })
      .catch((err) => {
        console.log('error: ', err);
      });
  };
  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.container}>
        <ImageBackground
          style={styles.imageLadding}
          resizeMode="cover"
          source={{
            uri:
              'https://images.unsplash.com/photo-1528720208104-3d9bd03cc9d4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1834&q=80',
          }}
          imageStyle={{backgroundColor: '#000', opacity: 0.8}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>About your</Text>
              <Text style={styles.title}>Body</Text>
            </View>
            <View style={styles.avatarContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{marginRight: 20}}>
                  {userInfor.avatar ? (
                    <Image
                      source={{uri: userInfor.avatar}}
                      style={{width: 52, height: 52, borderRadius: 120}}
                    />
                  ) : (
                    <Text>...Loading</Text>
                  )}
                </View>
                <View>
                  <Text
                    style={{
                      textTransform: 'uppercase',
                      color: '#d6d6d6',
                      fontSize: 24,
                      fontWeight: '700',
                    }}>
                    {userInfor.userName}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}>
              <View style={styles.customBox1}>
                <Text style={{fontSize: 15, color: '#fff', fontWeight: '700'}}>
                  RUNNING
                </Text>
              </View>
              <View style={styles.customBox2}>
                <Text style={{fontSize: 15, color: '#fff', fontWeight: '700'}}>
                  {resultTime.toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.aboutBody}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                <AntDesign
                  name="clockcircle"
                  color="#fff"
                  size={25}
                  style={{marginRight: 20}}
                />
                <Text style={{fontSize: 18, color: '#fff', fontWeight: '700'}}>
                  {diffMins > 0
                    ? `${diffMins} minutes`
                    : `not enough a minute!`}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                <Ionicons
                  name="flash-outline"
                  color="#fff"
                  size={25}
                  style={{marginRight: 20}}
                />
                <Text style={{fontSize: 18, color: '#fff', fontWeight: '700'}}>
                  {Math.ceil(avgSpeed)} m/s
                </Text>
              </View>
            </View>
            <View style={styles.aboutBody2}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                <MaterialCommunityIcons
                  name="fire"
                  color="#fff"
                  size={25}
                  style={{marginRight: 20}}
                />
                <Text style={{fontSize: 18, color: '#fff', fontWeight: '700'}}>
                  {totalmet && avgSpeed > 0
                    ? Math.round(
                        0.035 * weight +
                          ((avgSpeed * avgSpeed) / (height / 100)) *
                            0.029 *
                            weight,
                      )
                    : 0}{' '}
                  Calories/minute
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                <MaterialCommunityIcons
                  name="map-marker-distance"
                  color="#fff"
                  size={25}
                  style={{marginRight: 20}}
                />
                <Text style={{fontSize: 18, color: '#fff', fontWeight: '700'}}>
                  {Math.round(totalmet)} m
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => onInsertHistory()}>
                <Text style={{fontSize: 18, color: '#000', fontWeight: '700'}}>
                  Add to your journey
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => navigation.navigate('HomeDrawer')}>
                <Text style={{fontSize: 18, color: '#000', fontWeight: '700'}}>
                  Back
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

export default EndActivityScreen;

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
  headerContainer: {
    paddingTop: 70,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
  },
  customBox1: {
    padding: 12,
    backgroundColor: '#6f6f6f',
    borderRadius: 12,
    marginTop: 30,
    marginRight: 15,
  },
  customBox2: {
    padding: 12,
    backgroundColor: '#6f6f6f',
    borderRadius: 12,
    marginTop: 30,
  },
  avatarContainer: {
    paddingHorizontal: 30,
    marginTop: 20,
  },
  aboutBody: {
    marginTop: 40,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutBody2: {
    marginTop: 10,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 55,
    marginHorizontal: 30,
    marginTop: 160,
    alignSelf: 'center',
  },
});
