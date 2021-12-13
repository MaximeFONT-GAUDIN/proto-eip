import React, { useState, useEffect } from 'react';
import { Platform, Text, SafeAreaView, StyleSheet, TouchableOpacity, } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Accelerometer, Gyroscope  } from 'expo-sensors';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const LOCATION_TASK_NAME = 'background-location-task';

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
        );
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      } let location = await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, { accuracy: Location.Accuracy.BestForNavigation, activityType: Location.ActivityType.Other});
      setLocation(location);

      TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }) => {
        if (error) {
          setErrorMsg(
            `\`taskName\` must be a non-empty string. Got ${taskName} instead.`
          );
          return;
        } console.log('Received new locations', locations);
      });
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});