import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback } from 'react-native';
import { Audio } from 'expo-av';

import * as React from 'react';

export default function App() {
  const [recording, setRecording] = React.useState();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    setRecordedAudio(uri);
  }

  const [recordedAudio, setRecordedAudio] = React.useState();

  async function playRecordedAudio() {
    console.log('Playing recorded audio..');
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: recordedAudio });
      await soundObject.playAsync();
      console.log('Playing audio..');
    } catch (error) {
      console.log('Error playing audio: ', error);
    }
    console.log('Stopped recording..');

  }
  

  return (
    <View style={styles.container}>
      <View style={styles.uwotm8}>
        <Text>AUDIOxGPT</Text>
      </View>
      

      {/* SETTINGS BUTTON */}
      <View style={styles.settings}>
        <Text style={styles.settingsText}>Settings</Text>
      </View>

      {/* MMMMM BLOB */}
      {/* WILL LIKELY DO THIS VIA JS AND CSS */}
      <View style={styles.blob}>
        <Text>This is blob.</Text>
      </View>
  
      {/* RECORD BUTTON */}
      {/* <View style={styles.buttonCustom}>
        <Image source={'/assets/button.png'}/> 
      </View> */}

      {/* SECOND BUTTON AS WELL??? */}
      <View style={styles.buttonRecord}>
        <Button
          title={recording ? 'Stop Recording' : 'Start Recording'}
          onPress={recording ? stopRecording : startRecording}
        />
      </View>
    
      {recordedAudio && (
        <Button title="Play Recorded Audio" onPress={playRecordedAudio} />
      )}

        

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e0a57',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uwotm8: {
    flex: 1,
    color: 'white',
    justifyContent: 'center',
  },
  settings: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#ff0066',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsText: {
    color: '#fff',
    alignSelf: 'flex-end',
    padding: 20,
  },
  blob: {
    alignSelf: 'stretch',
    flex: 5,
    backgroundColor: '#502c6e',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonRecord: {
    alignSelf: 'stretch',
    flex: 2,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



