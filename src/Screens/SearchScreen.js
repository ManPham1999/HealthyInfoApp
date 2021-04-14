import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  RefreshControl,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Searchbar} from 'react-native-paper';
import Loading from '../Components/Loading';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from 'jwt-decode';

const SearchScreen = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [friends, setFriends] = useState([]);
  const [allfriends, setAllfriends] = useState([]);
  const [userInfor, setUserInfor] = useState({
    userName: '',
    avatar: '',
    height: 0,
    weight: 0,
    id: '',
    friendlist: [],
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
                friendlist: res.data.friendlist,
              });
            }
          })
          .catch((err) => {
            console.log('error: ', err);
          });
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
    Axios({
      method: 'GET',
      url: `https://capstoneprojectk23.herokuapp.com/api/user/getAllUsers`,
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .then((frds) => {
        setAllfriends(frds);
      })
      .catch((err) => {
        console.log('error: ', err);
      });
    onGetFriends();
  }, []);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    onGetFriends();
    Axios({
      method: 'GET',
      url: `https://capstoneprojectk23.herokuapp.com/api/user/getAllUsers`,
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .then((frds) => {
        setAllfriends(frds);
      })
      .then(() => setRefreshing(false))
      .catch((err) => {
        console.log('error: ', err);
      });
  }, []);
  const isFriend = (id) => {
    let result = 'add friend';
    console.log('recipient id :', id);
    userInfor.friendlist.forEach((element) => {
      console.log('element: ', element);
      if (element.status === 3 && element.recipient === id) {
        result = 'isFriend';
      } else if (element.status === 2 && element.recipient === id) {
        result = 'pending';
      } else if (element.status === 1 && element.recipient === id) {
        result = 'requested';
      }
    });
    return result;
  };
  const [searchQuery, setSearchQuery] = useState(null);
  const onChangeSearch = (query) => setSearchQuery(query);
  const onAddFriend = async (id) => {
    await Axios({
      method: 'POST',
      url: `https://capstoneprojectk23.herokuapp.com/api/user/request`,
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
      },
      data: {
        UserA: userInfor.id,
        UserB: id,
      },
    })
      .then((res) => {
        console.log(res.data);
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
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.title}>Friends Search</Text>
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
            {allfriends.length > 0 ? (
              allfriends
                .filter(
                  (item) =>
                    item.userName.includes(
                      searchQuery !== null ? searchQuery.toLowerCase() : '',
                    ) && userInfor.id !== item._id,
                )
                .map((item, index) => {
                  return (
                    <View style={styles.listContainer} key={index}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{marginRight: 20}}>
                          <Image
                            source={{
                              uri: item.avatar,
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
                            {item.userName}
                          </Text>
                          <Text style={{color: '#AEAEAE', fontSize: 14}}>
                            {item.weight} kg / {item.height} cm
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => onAddFriend(item._id)}
                          style={styles.customChallenge}>
                          <Text style={{color: '#fff', fontSize: 15}}>
                            {isFriend(item._id)}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          style={{marginLeft: 10}}></TouchableOpacity>
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

export default SearchScreen;

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
    marginBottom: 30,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
  },
  customAdd: {
    backgroundColor: '#00ACE2',
    padding: 6,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  customChallenge: {
    backgroundColor: '#44CAAC',
    padding: 6,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
