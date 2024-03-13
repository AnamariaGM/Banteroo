import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Animated, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Title from '../common/Title';
import { useLayout } from '@react-native-community/hooks';
import { LinearGradient } from 'expo-linear-gradient';


function SplashScreen({navigation}) {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    const translateY = new Animated.Value(0)
    const duration = 800

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: 20,
                    duration: duration,
                    useNativeDriver: true
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: duration,
                    useNativeDriver: true
                })
            ])
        ).start()
    }, [])

    return (
        <LinearGradient
            colors={['#6a9cfd', '#ffb8d0']} // Example gradient colors
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <StatusBar barStyle='light-content' />
            <Animated.View style={{ transform: [{ translateY }] }}>
                <Title text='Banteroo' color='#fff' />
            </Animated.View>
        </LinearGradient>
    )
}



export default SplashScreen;