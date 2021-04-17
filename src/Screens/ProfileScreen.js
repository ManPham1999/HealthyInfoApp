import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import jwt_decode from 'jwt-decode';
import Axios from 'axios';

const ProfileScreen = ({navigation}) => {
  const [userInfor, setUserInfor] = useState({
    userName: '',
    avatar: '',
    height: 0,
    weight: 0,
    id: '',
    status: false,
    gender: false,
  });
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('token');
      if (jsonValue != null) {
        const decoded = jwt_decode(JSON.parse(jsonValue));
        await Axios({
          method: 'GET',
          url: `https://capstoneprojectk23.herokuapp.com/api/user/getUserById/${decoded.payload.id}`,
          headers: {
            Accept: 'application/json; charset=utf-8',
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            if (res.data) {
              setUserInfor({
                userName: res.data.userName,
                avatar: res.data.avatar,
                height: res.data.height,
                weight: res.data.weight,
                id: res.data._id,
                status: res.data.status,
                gender: res.data.gender,
              });
            }
          })
          .catch((err) => {
            console.log('error: ', err);
          });
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.custom}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Your Profile</Text>
            </View>
            <View style={styles.backgroundContainer}>
              <View style={styles.profileImage}>
                {userInfor.avatar !== "" ? (
                  <Image
                    source={{uri: userInfor.avatar}}
                    style={styles.avatar}
                  />
                ) : (
                  <Image
                    source={require('../assets/avatar.jpg')}
                    style={styles.avatar}
                  />
                )}
                <Text style={styles.name}>
                  {userInfor !== null ? userInfor.userName : 'Cáo Fennec'}
                </Text>
                <Text style={{fontSize: 14, color: '#00bcd4'}}>
                  {userInfor !== undefined
                    ? userInfor.gender
                      ? 'Male'
                      : 'Female'
                    : 'Male'}
                </Text>
              </View>
              <View style={styles.info}>
                <View
                  style={{
                    alignItems: 'center',
                    borderColor: '#EAEAEA',
                    borderRightWidth: 2,
                  }}>
                  <View style={{alignItems: 'center', right: 45}}>
                    <Text style={{fontSize: 20}}>
                      {userInfor !== undefined ? userInfor.weight : 0} kg
                    </Text>
                    <Text style={styles.subtext}>Your weight</Text>
                  </View>
                </View>
                <View style={{alignItems: 'center', left: 45}}>
                  <Text style={{fontSize: 20}}>
                    {userInfor !== undefined ? userInfor.height : 0} cm
                  </Text>
                  <Text style={styles.subtext}>Your height</Text>
                </View>
              </View>
            </View>
            <View style={styles.setting}></View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    backgroundColor: '#000',
  },
  custom: {
    backgroundColor: '#FFF',
    height: '100%',
    paddingBottom: 5,
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
  },
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
  },
  backgroundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    backgroundColor: '#fff',
    padding: 75,
    paddingBottom: 55,
    borderRadius: 2,
    marginHorizontal: 30,
    shadowColor: '#222',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 7,
  },
  avatar: {
    borderRadius: 100,
    width: 100,
    height: 100,
  },
  profileImage: {
    marginTop: -130,
    overflow: 'hidden',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    textTransform: 'capitalize'
  },
  subtext: {
    fontSize: 14,
    color: '#aeb5bc',
  },
  setting: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 50,
  },
});
