import Axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from 'jwt-decode';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loading from '../Components/Loading';
const StatisticScreen = () => {
  const [report, setReport] = useState();
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('token');
      if (jsonValue != null) {
        const decoded = jwt_decode(JSON.parse(jsonValue));
        return {
          avatar: decoded.payload.avatar,
          email: decoded.payload.email,
          userName: decoded.payload.userName,
          id: decoded.payload.id,
        };
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  useEffect(() => {
    getData().then((user) => {
      Axios({
        method: 'GET',
        url: `https://capstoneprojectk23.herokuapp.com/api/user/getUserById/${user.id}`,
        headers: {
          Accept: 'application/json; charset=utf-8',
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.data) {
            setReport(res.data.reports);
          }
        })
        .catch((err) => {
          console.log('error: ', err);
        });
    });
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
              <View>
                <Text style={styles.title}>Diary</Text>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.iconRef}
                  onPress={() => {
                    return getData().then((user) => {
                      Axios({
                        method: 'GET',
                        url: `https://capstoneprojectk23.herokuapp.com/api/user/getUserById/${user.id}`,
                        headers: {
                          Accept: 'application/json; charset=utf-8',
                          'Content-Type': 'application/json',
                        },
                      })
                        .then((res) => {
                          if (res.data) {
                            setReport(res.data.reports);
                          }
                        })
                        .catch((err) => {
                          console.log('error: ', err);
                        });
                    });
                  }}>
                  <SimpleLineIcons name="refresh" color="#fff" size={28} />
                </TouchableOpacity>
              </View>
            </View>
            {report !== undefined ? (
              report.length > 0 ? (
                report.map((item, index) => (
                  <View key={index}>
                    <View style={styles.subContainer}>
                      <View>
                        <Text style={styles.nameActivity}>Walking</Text>
                      </View>
                      <View style={styles.dot}></View>
                      <Text style={styles.day}>{item.registerDate}</Text>
                    </View>
                    <View style={styles.healthInfo}>
                      <View>
                        <Image
                          style={styles.icon}
                          source={require('../assets/distance.png')}
                          resizeMode="contain"
                        />
                        <Text style={{marginTop: 15, fontSize: 18}}>
                          {Math.round(item.distance)}
                        </Text>
                        <Text style={{fontSize: 14, color: '#9e9e9e'}}>ms</Text>
                      </View>
                      <View>
                        <Image
                          style={styles.icon}
                          source={require('../assets/distance.png')}
                          resizeMode="contain"
                        />
                        <Text style={{marginTop: 15, fontSize: 18}}>
                          {item.time}
                        </Text>
                        <Text style={{fontSize: 14, color: '#9e9e9e'}}>m</Text>
                      </View>
                      <View>
                        <Image
                          style={styles.icon}
                          source={require('../assets/steps.png')}
                          resizeMode="contain"
                        />
                        <Text style={{marginTop: 15, fontSize: 18}}>
                          {Math.ceil(item.speedavg)}
                        </Text>
                        <Text style={{fontSize: 14, color: '#9e9e9e'}}>
                          m/s
                        </Text>
                      </View>
                      <View>
                        <Image
                          style={styles.icon}
                          source={require('../assets/calo.png')}
                          resizeMode="contain"
                        />
                        <Text style={{marginTop: 15, fontSize: 18}}>
                          {item.calories}
                        </Text>
                        <Text style={{fontSize: 14, color: '#9e9e9e'}}>
                          Calos/m
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text>empty</Text>
              )
            ) : (
              <Loading/>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default StatisticScreen;

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
  },
  subContainer: {
    paddingTop: 30,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameActivity: {
    fontSize: 22,
    fontWeight: '700',
    color: '#44caac',
  },
  dot: {
    backgroundColor: '#44caac',
    width: 6,
    height: 6,
    borderRadius: 50,
    marginLeft: 18,
    marginRight: 18,
    marginTop: 5,
  },
  day: {
    fontSize: 15,
    color: '#aaa',
    fontWeight: '500',
    marginTop: 2,
  },
  healthInfo: {
    marginTop: 30,
    marginHorizontal: 30,
    padding: 25,
    borderWidth: 2,
    borderColor: '#cfcfcf',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconRef: {
    backgroundColor: '#e52a2a',
    padding: 10,
    borderRadius: 14,
  },
});
