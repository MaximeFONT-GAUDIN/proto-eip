import React, { useState, useEffect } from 'react';
import { Platform, Text, SafeAreaView, StyleSheet, TouchableOpacity, } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Accelerometer, Gyroscope  } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(16);
  };

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  setStringValue = async () => {
    try {
      this.setState({ token: 'abc123' })
      await AsyncStorage.setItem('token', abc123);
    } catch(e) {
      setErrorMsg(`Storage Error`);
    }
    console.log('Done.')
  }

  getMyStringValue = async () => {
    try {
      return await AsyncStorage.getItem('token')
    } catch(e) {
      setErrorMsg(`Stored Error`);
    }
    console.log('Done.')
  }

  //multiSet = async () => {
  //  const firstPair = ["Accelerometer", "value_1"]
  //  const secondPair = ["Gyroscope", "value_2"]
  //  try {
  //    await AsyncStorage.multiSet([firstPair, secondPair])
  //  } catch(e) {
  //    setErrorMsg(`Storage Error`);
  //  }
  //  console.log("Done.")
  //}

  const { x, y, z } = data;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text style={styles.text}>
        x: {round(x)} y: {round(y)} z: {round(z)}
      </Text>
      <SafeAreaView style={styles.buttonContainer}>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});