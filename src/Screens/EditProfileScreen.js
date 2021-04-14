import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const EditProfileScreen = () => {
    return (
        <>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <SafeAreaView style={styles.container}>
                <View style={styles.custom}>
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}                      
                    >
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    )
}

export default EditProfileScreen

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        left:0,
        right:0,
        top:0,
        height:'100%',
        backgroundColor:'#000',
    },
    custom: {
        backgroundColor: '#fff',
        height:'100%',
        paddingBottom: 5,
        borderBottomLeftRadius: 44,
        borderBottomRightRadius: 44,
    },
})
