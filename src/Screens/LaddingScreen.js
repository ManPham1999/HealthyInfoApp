import React from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

const LaddingScreen = ({navigation}) => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.container}>
        <ImageBackground
          style={styles.imageLadding}
          resizeMode="cover"
          source={require('../assets/imagebg.jpg')}
          imageStyle={{backgroundColor: '#000', opacity: 0.8}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <Image
              style={styles.logo}
              source={require('../assets/healthinfo.png')}
            />
            <View style={styles.introduce}>
              <Text style={styles.title}>HEY RUNNER</Text>
              <View style={{marginTop: 15}}>
                <Text style={styles.desc}>Take care of your body. </Text>
                <Text style={styles.desc}>
                  It's the only place you have to live.
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('LoginSplash');
                }}>
                <View style={styles.customButton}>
                  <Text
                    style={{color: '#fff', fontSize: 16, fontWeight: '700'}}>
                    Get Started
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    </>
  );
};

export default LaddingScreen;

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
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    top: -40,
  },
  introduce: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 280,
  },
  title: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '700',
  },
  desc: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  customButton: {
    marginTop: 35,
    backgroundColor: '#44CAAC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    width: 300,
    height: 50,
  },
});
