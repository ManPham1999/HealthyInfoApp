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
import Entypo from 'react-native-vector-icons/Entypo';
import {Searchbar} from 'react-native-paper';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from 'jwt-decode';
import Loading from '../Components/Loading';

const FriendListScreen = ({navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);
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
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.title}>Friends List</Text>
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
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            onTouchEnd={() => navigation.navigate('SearchScreen')}
            style={{
              backgroundColor: '#eeeeee',
              borderRadius: 12,
            }}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{marginTop: 25}}>
            {friends.length > 0 ? (
              friends
                .filter((item) => item.status === 3)
                .map((item, index) => {
                  return (
                    <View style={styles.listContainer} key={index}>
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
                              textTransform: 'capitalize'
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
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          style={styles.customChallenge}>
                          <Text style={{color: '#fff', fontSize: 15}}>
                            Is Friend
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          style={{marginLeft: 10}}>
                          <Entypo
                            name="dots-three-vertical"
                            color="#000"
                            size={18}
                          />
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
};

export default FriendListScreen;

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
  customChallenge: {
    backgroundColor: '#44CAAC',
    padding: 6,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
