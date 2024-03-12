import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Animated, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Title from '../common/Title';
import { useLayout } from '@react-native-community/hooks';

function SplashScreen({navigation}){

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerShown: false
        })

    },[])


    const translateY = new Animated.Value(0)
    const duration = 800

    useEffect(()=>{
        Animated.loop(
            Animated.sequence([
    
                Animated.timing(translateY,{
                    toValue:20,
                    duration:duration,
                    useNativeDriver: true
                }),
                Animated.timing(translateY,{
                    toValue:0,
                    duration:duration,
                    useNativeDriver: true
                })
            ])
        )
        .start()

    },[])
    return (
        <SafeAreaView style={{
            flex:1,
            alignItems:'center',
            justifyContent:'center',
            backgroundColor:'black'
        }}><StatusBar barStyle='light-content' />
        <Animated.View style={{transform:[{translateY}] }}>
            <Title text='Banteroo' color='white'></Title>
        </Animated.View>

        </SafeAreaView>
        
    )
}


export default SplashScreen;