import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {Title, Caption, Drawer} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';
import jwt_decode from 'jwt-decode';
import Axios from 'axios';
const DrawerMenu = (props) => {
  const {navigation} = props;
  const signOut = async () => {
    try {
      await revokeAccess();
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('token');
      await RNRestart.Restart();
      navigation.navigate('LoginSplash');
    } catch (error) {
      console.error(error);
    }
  };
  const revokeAccess = async () => {
    try {
      await GoogleSignin.revokeAccess();
      console.log('deleted');
    } catch (error) {
      console.error(error);
    }
  };
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
      <SafeAreaView style={{flex: 1}}>
        <DrawerContentScrollView {...props}>
          <View style={styles.drawerContent}>
            <ImageBackground
              source={require('../assets/drawer.jpg')}
              style={{width: undefined, paddingBottom: 25, marginTop: -80}}
              resizeMode="cover">
              <View style={styles.userInfo}>
                <View style={{marginTop: 35}}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      props.navigation.navigate('Profile');
                    }}>
                    {userInfor.avatar !== '' ? (
                      <Image
                        source={{uri: userInfor.avatar}}
                        size={100}
                        style={styles.avatar}
                      />
                    ) : (
                      <Image
                        source={require('../assets/avatar.jpg')}
                        size={100}
                        style={styles.avatar}
                      />
                    )}
                  </TouchableOpacity>
                  <View style={{flexDirection: 'column'}}>
                    <Title style={styles.title}>
                      {userInfor?.userName || 'Cáo Fennec'}
                    </Title>
                  </View>
                </View>
                <View style={styles.row}>
                  <View>
                    <Caption style={styles.caption}>
                      {userInfor?.height || '0'} cm
                    </Caption>
                  </View>
                  <View style={styles.section}>
                    <Caption style={styles.caption}>/</Caption>
                  </View>
                  <View>
                    <Caption style={styles.caption}>
                      {userInfor?.weight || '0'} kg
                    </Caption>
                  </View>
                </View>
              </View>
            </ImageBackground>
            <Drawer.Section style={styles.drawerSection}>
              <DrawerItem
                icon={({size}) => (
                  <Feather name="home" color="#1f2233" size={size} />
                )}
                label="Home"
                onPress={() => {
                  props.navigation.navigate('Home');
                }}
                labelStyle={{color: '#1f2233'}}
              />
              <DrawerItem
                icon={({size}) => (
                  <AntDesign name="notification" color="#1f2233" size={size} />
                )}
                label="Notifications"
                onPress={() => {
                  props.navigation.navigate('Notification');
                }}
                labelStyle={{color: '#1f2233'}}
              />
              <DrawerItem
                icon={({size}) => (
                  <Ionicons name="people-outline" color="#1f2233" size={size} />
                )}
                label="Friends List"
                onPress={() => {
                  props.navigation.navigate('FriendsList');
                }}
                labelStyle={{color: '#1f2233'}}
              />
              <DrawerItem
                icon={({size}) => (
                  <Ionicons name="search-outline" color="#1f2233" size={size} />
                )}
                label="Search"
                onPress={() => {
                  props.navigation.navigate('SearchScreen');
                }}
                labelStyle={{color: '#1f2233'}}
              />
              {/* <Drawer.Section style={{ marginTop: 5 }}></Drawer.Section> */}
            </Drawer.Section>
          </View>
          <DrawerItem
            icon={({size}) => (
              <AntDesign name="setting" color="#1f2233" size={size} />
            )}
            label="Settings"
            onPress={() => {
              props.navigation.navigate('Setting');
            }}
            labelStyle={{color: '#1f2233'}}
          />
        </DrawerContentScrollView>
        <Drawer.Section style={styles.bottomDrawer}>
          <DrawerItem
            icon={({size}) => (
              <AntDesign name="poweroff" color="#1f2233" size={size} />
            )}
            label="Log Out"
            labelStyle={{fontWeight: 'bold', color: '#1f2233'}}
            onPress={() => signOut()}
          />
        </Drawer.Section>
      </SafeAreaView>
    </>
  );
};

export default DrawerMenu;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    color: '#fff',
    textTransform: 'capitalize'
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: '#fff',
  },
  drawerSection: {
    marginTop: 10,
  },
  bottomDrawer: {
    marginBottom: 0,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  row: {
    marginTop: 5,
    flexDirection: 'row',
  },
  section: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 40,
  },
});
