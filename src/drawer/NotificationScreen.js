import React, {useEffect, useState} from 'react';
import {
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from 'jwt-decode';
import Loading from '../Components/Loading';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

function FriendRequest({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const [friends, setFriends] = useState([]);
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
  const convertIdToUser = async (id) => {
    return await Axios({
      method: 'GET',
      url: `https://capstoneprojectk23.herokuapp.com/api/user/getUserById/${id}`,
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.data) {
          return {
            userName: res.data.userName,
            avatar: res.data.avatar,
            height: res.data.height,
            weight: res.data.weight,
            id: res.data._id,
            status: res.data.status,
          };
        }
      })
      .catch((err) => {
        console.log('error: ', err);
      });
  };
  const onGetFriends = async () => {
    await getData().then((user) => {
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
            return res.data.friendlist;
          }
        })
        .then(async (frds) => {
          for (let i = 0; i < frds.length; i++) {
            frds[i].recipient = await convertIdToUser(frds[i].recipient);
          }
          return frds;
        })
        .then((newArr) => {
          setFriends(newArr);
        })
        .catch((err) => {
          console.log('error: ', err);
        });
    });
  };
  useEffect(() => {
    onGetFriends();
  }, []);
  const onAccept = async (user) => {
    await Axios({
      method: 'POST',
      url: `https://capstoneprojectk23.herokuapp.com/api/user/accept`,
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
      },
      data: {
        UserA: user.requester,
        UserB: user.recipient.id,
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log('error: ', err);
      });
  };
  const onReject = async (user) => {
    await Axios({
      method: 'POST',
      url: `https://capstoneprojectk23.herokuapp.com/api/user/reject`,
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
      },
      data: {
        UserA: user.requester,
        UserB: user.recipient.id,
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log('error: ', err);
      });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    onGetFriends().then((boo) => setRefreshing(false));
  }, []);

  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query) => setSearchQuery(query);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{marginTop: 25}}>
            {friends.length > 0 ? (
              friends
                .filter((friend) => friend.status === 2)
                .map((item, index) => {
                  return (
                    <View style={styles.listContainer} key={item._id}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{marginRight: 20}}>
                          <Image
                            source={{
                              uri: item.recipient.avatar,
                            }}
                            style={{width: 54, height: 54, borderRadius: 120}}
                          />
                        </View>
                        <View>
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 16,
                              fontWeight: '700',
                            }}>
                            {item.recipient.userName}
                          </Text>
                          <Text style={{color: '#AEAEAE', fontSize: 14}}>
                            {item.recipient.weight} kg / {item.recipient.height}{' '}
                            cm
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}
                        key={index}>
                        <TouchableOpacity
                          onPress={() => onAccept(item)}
                          activeOpacity={0.5}
                          style={styles.customConfirm}>
                          <Text style={{color: '#fff', fontSize: 15}}>
                            Confirm
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => onReject(item)}
                          activeOpacity={0.5}
                          style={{marginLeft: 10}}>
                          <AntDesign name="close" color="#595959" size={18} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
            ) : (
              <Loading />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function ChallengeRequest({navigation}) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{marginTop: 25}}>
            <View style={styles.listContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{marginRight: 20}}>
                  <Image
                    source={{
                      uri:
                        'https://scontent.fsgn2-3.fna.fbcdn.net/v/t31.0-8/28619103_2034912613428758_7493420670478077899_o.jpg?_nc_cat=106&ccb=2&_nc_sid=174925&_nc_ohc=AH3j7_AvvuoAX_vX7OK&_nc_ht=scontent.fsgn2-3.fna&oh=5a98c2b51795e9dbdcaf46e4078b5851&oe=60010023',
                    }}
                    style={{width: 54, height: 54, borderRadius: 120}}
                  />
                </View>
                <View>
                  <Text
                    style={{color: '#000', fontSize: 16, fontWeight: '700'}}>
                    Man Pham
                  </Text>
                  <Text style={{color: '#AEAEAE', fontSize: 14}}>
                    62 kg / 169 cm
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.customConfirm}>
                  <Text style={{color: '#fff', fontSize: 15}}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={{marginLeft: 10}}>
                  <AntDesign name="close" color="#595959" size={18} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="FriendRequest"
      swipeEnabled
      animationEnabled
      tabBarOptions={{
        activeTintColor: '#000',
        inactiveTintColor: '#AFAFAF',
        pressColor: '#eee',
        upperCaseLabel: false,
        labelStyle: {fontSize: 15, fontWeight: '700', textTransform: 'none'},
        style: {backgroundColor: '#fff'},
        indicatorStyle: {
          backgroundColor: '#44CAAC',
        },
      }}>
      <Tab.Screen
        name="FriendRequest"
        component={FriendRequest}
        options={{tabBarLabel: 'Friend Request'}}
      />
      <Tab.Screen
        name="ChallengeRequest"
        component={ChallengeRequest}
        options={{tabBarLabel: 'Challenge Request'}}
      />
    </Tab.Navigator>
  );
}

export default function NotificationScreen({navigation}) {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.title}>Notifications</Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.iconClose}
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign name="closesquare" size={50} />
            </TouchableOpacity>
          </View>
        </View>
        <MyTabs />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
  },
  searchContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
  },
  customConfirm: {
    backgroundColor: '#00ACE2',
    padding: 6,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
