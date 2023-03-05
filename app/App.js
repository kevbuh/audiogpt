import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';

import * as React from 'react';
import * as FileSystem from 'expo-file-system';

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

  async function playFinal() {
    const soundObject = new Audio.Sound();
    try {
      console.log(`\n ------- trying  ------- \n`);

      await soundObject.loadAsync({ uri: "abc.mp3" });

      console.log(`\n ------- playing...  ------- \n`);

      await soundObject.playAsync();
      console.log('Playing audio..');
    } catch (error) {
      console.log('Error playing audio: ', error);
    }
    console.log('Finished audio..');

    return "bob"
  }

  async function playRecordedAudio() {
    console.log('\n ------- Fetching recorded audio... ------- \n');
    const apiUrl = 'http://127.0.0.1:5000/pipeline';

    const audioFile = recordedAudio; // replace with uri path
    console.log(`\n ------- making form  ------- \n`);
    // Create a new FormData object
    const formData = new FormData();
    formData.append('file', {
      uri: audioFile,
      type: 'audio/mp4',
      name: 'audio.m4a'
    });

    console.log(`\n ------- fetching data  ------- \n`);

    const result = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then( async response => {
      const soundObject = new Audio.Sound();

      try {
      console.log('*%*59898#@$$#@');
      const fileInfo = await FileSystem.getInfoAsync("/Users/kevinbuhler/Code/audiogpt/api/abc.mp3");
      console.log('*****',fileInfo)
      if (fileInfo.exists) {
        await soundObject.loadAsync({ uri: fileInfo.uri });
        await soundObject.playAsync();
        console.log('Playing audio...');
      } else {
        console.log(`File not found: ${filePath}`);
      }

      } catch (error) {
        console.log('Error playing audio: ', error);
      }
      console.log('Stopped recording...');
      
      console.log('\n ------- DONE! ------- \n');
      
    })
    
  }

  return (
    <View style={styles.container}>
      <Text>AUDIOxGPT</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />

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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});