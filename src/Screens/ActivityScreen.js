import React, {useEffect, useRef, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Carousel from 'react-native-anchor-carousel';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ActivityScreen = ({navigation}) => {
  const [background, setBackground] = useState({
    uri:
      'https://cutewallpaper.org/21/cute-wallpaper-for-dp/Images-of-Whatsapp-Wallpaper-Whatsapp-Dp-Images-Download.jpg',
    name: 'Walking',
    desc:
      'Walking is a great way to improve or maintain your overall health. Just 30 minutes every day can increase cardiovascular fitness, strengthen bones, and boost muscle power and endurance.',
  });

  const [gallery, setgallery] = useState([
    {
      image:
        'https://cutewallpaper.org/21/cute-wallpaper-for-dp/Images-of-Whatsapp-Wallpaper-Whatsapp-Dp-Images-Download.jpg',
      title: 'WALKING',
      desc:
        'Walking is a great way to improve or maintain your overall health. Just 30 minutes every day can increase cardiovascular fitness, strengthen bones, and boost muscle power and endurance.',
      key: '1,',
    },
    {
      image:
        'https://images.unsplash.com/photo-1559166631-ef208440c75a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1834&q=80',
      title: 'RUNNING',
      desc:
        'Runners have increased lung capacity from logging mile after mile. Those strong lungs come in handy if you ever find yourself on the other side of the race as a spectator.',
      key: '2,',
    },
    {
      image:
        'https://images.unsplash.com/photo-1531502774286-5e4e8e94879f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1834&q=80',
      title: 'CYCLING',
      desc:
        'Easy – unlike some other sports, cycling does not require high levels of physical skill. Most people know how to ride a bike and, once you learn, you don’t forget.',
      key: '3,',
    },
  ]);

  const carouselRef = useRef(null);
  const {width, height} = Dimensions.get('window');
  const renderItem = ({item, index}) => {
    return (
      <>
        <View>
          <TouchableOpacity
            onPress={() => {
              carouselRef.current.scrollToIndex(index);
              setBackground({
                uri: item.image,
                name: item.title,
                desc: item.desc,
              });
            }}>
            <Image source={{uri: item.image}} style={styles.carouselImage} />
            <Text style={styles.carouselText}>{item.title}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.custom,
            {...StyleSheet.absoluteFill, backgroundColor: '#000'},
          ]}>
          <ImageBackground
            source={{uri: background.uri}}
            style={styles.imageBg}
            resizeMode="cover"
            blurRadius={5}
            imageStyle={{
              borderWidth: 0,
              borderBottomLeftRadius: 44,
              borderBottomRightRadius: 44,
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <View style={styles.headerContainer}>
                <View>
                  <Text style={styles.title}>Choose your</Text>
                  <Text style={styles.title}>Activity</Text>
                </View>
                <View style={styles.iconCompetition}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      navigation.navigate('FriendsList');
                    }}>
                    <MaterialCommunityIcons
                      name="sword-cross"
                      color="#fff"
                      size={35}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.carouselContentContainerView}>
                <Carousel
                  style={styles.carousel}
                  data={gallery}
                  renderItem={renderItem}
                  itemWidth={200}
                  containerWidth={width - 20}
                  separatorWidth={0}
                  ref={carouselRef}
                  inActiveOpacity={0.4}
                  onScrollEnd={(index) => {
                    setBackground({
                      uri: index.image,
                      name: index.title,
                      stat: index.released,
                      desc: index.desc,
                    });
                  }}
                />
              </View>
              <View style={styles.InfoContainer}>
                <View style={{justifyContent: 'center'}}>
                  <Text style={styles.activityDesc}>{background.desc}</Text>
                </View>
              </View>
              <View style={{alignItems: 'center', marginTop: 30}}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate('Running');
                  }}>
                  <View style={styles.customButton}>
                    <Text
                      style={{color: '#000', fontSize: 16, fontWeight: '700'}}>
                      Let's Go
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </ImageBackground>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ActivityScreen;

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
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
  },
  imageBg: {
    flex: 1,
    width: '100%',
    height: '100%',
    opacity: 1,
    justifyContent: 'flex-start',
    resizeMode: 'cover',
  },
  carouselContentContainerView: {
    width: '100%',
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carousel: {
    flex: 1,
    overflow: 'visible',
  },
  carouselImage: {
    width: 200,
    height: 320,
    borderRadius: 22,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  carouselText: {
    padding: 14,
    color: '#fff',
    position: 'absolute',
    bottom: '40%',
    left: '18%',
    fontWeight: '700',
    fontSize: 25,
  },
  activityDesc: {
    paddingHorizontal: 30,
    color: '#fff',
    fontSize: 14,
    marginTop: 15,
    lineHeight: 18,
    opacity: 0.8,
  },
  customButton: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    width: 120,
    height: 40,
  },
  iconCompetition: {
    backgroundColor: '#e52a2a',
    padding: 12,
    borderRadius: 14,
  },
});
