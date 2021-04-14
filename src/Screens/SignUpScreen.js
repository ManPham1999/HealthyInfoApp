import React from 'react'
import { ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { TextInput } from 'react-native-paper';

export default class SignUpScreen extends React.Component {
  render() {
    return (
        <>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={styles.container}>
                <ImageBackground 
                style={styles.imageLadding}
                resizeMode="cover" 
                source={require('../assets/imagebg.jpg')}
                imageStyle={{ backgroundColor:'#000', opacity: 0.8 }} 
                >
                    <View style={styles.header}>
                      <Animatable.Image
                        animation="bounceIn"
                        duration={1500}
                        style={styles.logo}
                        source={require('../assets/healthinfo.png')} 
                      />
                    </View>
                    <Animatable.View 
                    style={styles.footer}
                    animation="fadeInUpBig"
                    >
                        <View style={styles.line}></View>
                        <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}                          
                        >
                        <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.goBack()}>
                            <MaterialIcons name='arrow-back-ios' color='#233249' size={30} style={styles.iconBack} />
                        </TouchableOpacity>
                        <View style={{marginTop: 25, marginHorizontal: 20}}>
                            <Text style={styles.title}>Create Account</Text>
                        </View>
                        <View style={styles.input}>
                            <TextInput 
                            placeholder={'Full Name'} 
                            underlineColor='transparent'  
                            placeholderTextColor = "#A5A3A3"
                            autoCapitalize = "none" 
                            theme={{ colors: '#fff' }}
                            style={styles.textInput} />
                        </View>
                        <View style={styles.input}>
                            <TextInput 
                            placeholder={'Email'} 
                            underlineColor='transparent'  
                            placeholderTextColor = "#A5A3A3"
                            autoCapitalize = "none" 
                            theme={{ colors: '#fff' }}
                            style={styles.textInput} />
                        </View>
                        <View style={styles.input}>
                            <TextInput 
                            placeholder={'Username'} 
                            underlineColor='transparent'  
                            placeholderTextColor = "#A5A3A3"
                            autoCapitalize = "none" 
                            theme={{ colors: '#fff' }}
                            style={styles.textInput} />
                        </View>
                        <View style={styles.input}>
                            <TextInput 
                            placeholder={'Password'}
                            underlineColor='transparent' 
                            theme={{ colors: '#fff' }}
                            placeholderTextColor = "#A5A3A3"
                            autoCapitalize = "none"  
                            style={styles.textInput} 
                            secureTextEntry={true} />
                        </View>
                        <View style={styles.input}>
                            <TextInput 
                            placeholder={'Confirm Password'}
                            underlineColor='transparent' 
                            theme={{ colors: '#fff' }}
                            placeholderTextColor = "#A5A3A3"
                            autoCapitalize = "none"  
                            style={styles.textInput} 
                            secureTextEntry={true} />
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.navigation.navigate('LoginScreen')}>
                            <View style={styles.buttonLogin}>
                                <Text style={styles.textLogin}>Sign Up</Text>
                            </View>
                        </TouchableOpacity>
                      </ScrollView>  
                    </Animatable.View>
                </ImageBackground>
            </View>
        </>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
    },
    imageLadding: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: "flex-start",
        resizeMode: "cover",
    },
    logo: {
        width: 250,
        height: 250,
        alignSelf: 'center',
        top: -40
    },
    header: {
        flex: 1,
    },
    footer: {
        flex: 2.5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    line: {
        borderWidth: 3,
        borderColor: '#D3D3D3',
        width: 40,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: -10,
    },
    title: {
        fontSize: 25,
        color: '#233249',
        fontWeight: '700',
        textAlign: 'center',
        marginTop: -20,
    },
    desc: {
        fontSize: 17,
        color: '#9EA1A7',
        textAlign: 'center'
    },
    iconBack: {
        marginHorizontal: 20,
        marginTop: 15,
    },
    input: {
        borderColor: '#252427',
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 55,
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 15,
    },
    textInput: {
        flex: 1,
        backgroundColor: 'transparent',
        fontSize: 15,
        height: 55,
        borderColor: 'transparent',
    },
    buttonLogin: {
        backgroundColor: '#252427',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 55,
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 15,
    },
    textLogin: {
        color: '#fff',
        fontSize: 18,
    },
})
