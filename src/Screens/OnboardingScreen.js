import React, {useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScrollPicker from 'react-native-wheel-scroll-picker';
import * as Animatable from 'react-native-animatable';

const Stack = createStackNavigator();

const IdentifyScreen = ({navigation}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <Animatable.View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.goBack()}>
              <MaterialIcons
                name="arrow-back-ios"
                color="#233249"
                size={25}
                style={styles.iconBack}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 40}}>
            <Text style={styles.title}>How do you identify?</Text>
            <View>
              <Text style={styles.desc}>
                We ask this to make sure your journey
              </Text>
              <Text style={styles.desc}>is fun, healthy and balanced.</Text>
            </View>
          </View>
          <View style={styles.selectIdentify}>
            <TouchableOpacity
              onPress={() => {
                setActiveIndex(0);
              }}
              style={activeIndex === 0 ? styles.btnActive : styles.btn}>
              <Text style={activeIndex === 0 ? styles.textActive : styles.txt}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveIndex(1);
              }}
              style={activeIndex === 1 ? styles.btnActive : styles.btn}>
              <Text style={activeIndex === 1 ? styles.textActive : styles.txt}>
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActiveIndex(2);
              }}
              style={activeIndex === 2 ? styles.btnActive : styles.btn}>
              <Text style={activeIndex === 2 ? styles.textActive : styles.txt}>
                Non-binary
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, marginTop: 80}}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => navigation.navigate('TallScreen')}>
              <Text style={{color: '#fff', fontSize: 18, fontWeight: '700'}}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </>
  );
};

function TallScreen({navigation}) {
  let animation = useRef(new Animated.Value(0));
  const width = animation.current.interpolate({
    inputRange: [33, 100],
    outputRange: ["33%", "100%"],
    extrapolate: "clamp"
  })
  return (
      <Animatable.View animation="fadeIn" style={styles.container}>
          <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}              
          >
              <View style={styles.header}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
                          <MaterialIcons name='arrow-back-ios' color='#233249' size={25} style={styles.iconBack} />
                  </TouchableOpacity>
              </View>
              {/* <View style={styles.progressBar}>
                  <Animated.View 
                  style={[StyleSheet.absoluteFill], 
                  {backgroundColor: "#44CAAC", width,borderRadius: 100 }}
                  />
              </View> */}
              <View style={{marginTop: 40}}>
                  <Text style={styles.title}>How tall are you?</Text>
                  <View>
                      <Text style={styles.desc}>This helps us to define your body</Text>
                      <Text style={styles.desc}>shape and calibrate your plan.</Text>
                  </View>
              </View>
              <View style={styles.picker}>
                  <ScrollPicker
                  dataSource={["169", "170", "171", "172", "173", "174"]}
                  selectedIndex={2}
                  renderItem={(data, index) => {
                      // return(
                      //     <View>
                      //         <Text>{data}</Text>
                      //     </View>
                      // )
                  }}
                  onValueChange={(data, selectedIndex) => {
                      //
                  }}
                  wrapperHeight={180}
                  wrapperWidth={150}
                  wrapperBackground={"#fff"}
                  itemHeight={60}
                  highlightColor={"#fff"}
                  highlightBorderWidth={2}
                  activeItemTextStyle={{color: '#233249', fontSize: 40}}
                  itemTextStyle={{color: '#D7D7D7', fontSize: 22}}
                  />
                  <Text style={{marginLeft: 10, fontSize: 30, color: '#233249'}}>cm</Text>
              </View>
              <View style={{flex: 1, marginTop: 119}}>
                  <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('WeightScreen')}>
                      <Text style={{color: '#fff', fontSize: 16, fontWeight: '700'}}>Continue</Text>
                  </TouchableOpacity>
              </View>
          </ScrollView>
      </Animatable.View>
  )
}

function WeightScreen({navigation}) {
  let animation = useRef(new Animated.Value(0));
  const width = animation.current.interpolate({
    inputRange: [66, 100],
    outputRange: ["66%", "100%"],
    extrapolate: "clamp"
  })
  return (
      <Animatable.View animation="fadeIn" style={styles.container}>
          <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}            
          >
              <View style={styles.header}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
                          <MaterialIcons name='arrow-back-ios' color='#233249' size={25} style={styles.iconBack} />
                  </TouchableOpacity>
              </View>
              {/* <Animated.View style={styles.progressBar}>
                  <Animated.View 
                  style={[StyleSheet.absoluteFill], 
                  {backgroundColor: "#44CAAC", width,borderRadius: 100}}
                  />
              </Animated.View> */}
              <View style={{marginTop: 40}}>
                  <Text style={styles.title}>How much do you weight?</Text>
                  <View>
                      <Text style={styles.desc}>This helps us to determine your bmi</Text>
                      <Text style={styles.desc}>( body mass index).</Text>
                  </View>
              </View>
              <View style={styles.picker}>
                  <ScrollPicker
                  dataSource={["52, 53", "54", "55", "56", "57", "58"]}
                  selectedIndex={2}
                  renderItem={(data, index) => {
                      // return(
                      //     <View>
                      //         <Text>{data}</Text>
                      //     </View>
                      // )
                  }}
                  onValueChange={(data, selectedIndex) => {
                      //
                  }}
                  wrapperHeight={180}
                  wrapperWidth={150}
                  wrapperBackground={"#fff"}
                  itemHeight={60}
                  highlightColor={"#fff"}
                  highlightBorderWidth={2}
                  activeItemTextStyle={{color: '#233249', fontSize: 40}}
                  itemTextStyle={{color: '#D7D7D7', fontSize: 22}}
                  />
                  <Text style={{marginLeft: 10, fontSize: 30, color: '#233249'}}>kg</Text>
              </View>
              <View style={{flex: 1, marginTop: 119}}>
                  <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('DoitScreen')}>
                      <Text style={{color: '#fff', fontSize: 16, fontWeight: '700'}}>Continue</Text>
                  </TouchableOpacity>
              </View>
          </ScrollView>
      </Animatable.View>
  )
}

function DoitScreen({navigation}) {
  return (
      <Animatable.View animation="fadeIn" style={styles.doitContainer}>
          <ImageBackground
          source={require('../assets/confetti.png')}
          style={styles.imageBg}
          resizeMode="cover"
          >
              <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}     
              >
                  <View style={styles.doitHeader}>
                      <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
                          <MaterialIcons name='arrow-back-ios' color='#233249' size={25} style={styles.iconBack} />
                      </TouchableOpacity>                        
                  </View>
                  <Image style={styles.avatar} source={require('../assets/avatar.jpg')} />
                  <View style={{marginTop: 100}}>
                      <Text style={styles.doitTitle}>Wohoo 🎉</Text>
                      <Text style={styles.doitTitle}>Now let’s get you movin’</Text>
                  </View>
                  <View style={{alignItems: 'center', flex: 1, marginTop: 209}}>
                      <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('DrawerHome')}>
                          <Text style={{color: '#fff', fontSize: 16, fontWeight: '700'}}>Let's do it!</Text>
                      </TouchableOpacity>
                  </View>
              </ScrollView>
          </ImageBackground>
      </Animatable.View>
  )
}

const OnboardingScreen = ({navigation}) => {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Stack.Navigator initialRouteName="IdentifyScreen" headerMode="none">
        <Stack.Screen name="IdentifyScreen" component={IdentifyScreen} />
        <Stack.Screen name="TallScreen" component={TallScreen} />
        <Stack.Screen name="WeightScreen" component={WeightScreen} />
        <Stack.Screen name="DoitScreen" component={DoitScreen} />
      </Stack.Navigator>
    </>
  );
};
export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff'
  },
  customButton: {
      backgroundColor: "#44CAAC",
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: 330,
      height: 50,
      flexDirection: "row",
      marginHorizontal: 20,
      marginTop: 25,
  },
  header: {
      paddingTop: 70,
      marginHorizontal: 20,
  },
  title: {
      color: '#233249',
      fontSize: 23,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 50
  },
  desc: {
      color: '#9EA1A7',
      fontSize: 15,
      textAlign: 'center',
  },
  btnActive: {
      backgroundColor: "#44CAAC",
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: 330,
      height: 50,
      flexDirection: "row",
      marginHorizontal: 20,
      marginTop: 15,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
          width: 1,
          height: 1,
      },
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 4,
      marginBottom: 8,
  },
  btn:{
      backgroundColor: "#fff",
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: 330,
      height: 50,
      flexDirection: "row",
      marginHorizontal: 20,
      marginTop: 15,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
          width: 1,
          height: 1,
      },
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 4,
      marginBottom: 8,
  },
  selectIdentify: {
      marginTop: 50,
  },
  textActive: {
      color: '#fff', 
      fontSize: 16
  },
  txt: {
      color: '#233249', 
      fontSize: 16
  },
  doitContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: "100%",
      backgroundColor: '#fff'
  },
  imageBg: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: "flex-start",
      resizeMode: "cover",
  },
  avatar:{
      borderRadius: 100,
      width: 100,
      height: 100,
      marginTop: 30,
      alignSelf: 'center'
  },
  doitTitle: {
      color: '#233249',
      fontSize: 23,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 5,
  },
  doitHeader:{
      paddingTop: 70,
      marginHorizontal: 40,
  },
  progressBar: {
      flexDirection: 'row',
      alignSelf: 'center',
      height: 12,
      width: '100%',
      backgroundColor: '#E2E6ED',
      borderColor: '#E2E6ED',
      borderWidth: 1,
      borderRadius: 100,
      marginTop: 40,
  },
  picker: {
      marginTop: 50,
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 120,
  }
})
