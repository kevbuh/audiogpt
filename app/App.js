import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
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
    // .then( async response => {
    //   response.json();
    //   console.log(`\n ------- got fetched data mp3  ------- \n`);
    //   const soundObject = new Audio.Sound();
    //   try {
    //     console.log(`\n ------- trying  ------- \n`);

    //     const red1 = await soundObject.loadAsync({ uri: "api/abc.mp3" });
    //     console.log(red1)
    //     console.log(`\n ------- playing...  ------- \n`);

    //     await soundObject.playAsync();
    //     console.log('Playing audio..');
    //   } catch (error) {
    //     console.log('Error playing audio: ', error);
    //   }
    //   console.log('Stopped recording..');
      
    // })
    .then(async response => {
      // const data = await response.json();
      console.log(`\n ------- got fetched data mp3  ------- \n`);
      setRecordedAudio("abc.mp3");
        // console.log(`\n ------- trying  ------- \n`);

      const bob = await playFinal()

    })
    .catch(error => {
      console.error(error);
    });

    // console.log('\n ------- Playing fetched audio... ------- \n');
    console.log('\n ------- DONE! ------- \n');


    // const soundObject = new Audio.Sound();
    // try {
    //   await soundObject.loadAsync({ uri: recordedAudio });
    //   await soundObject.playAsync();
    //   console.log('Playing audio..');
    // } catch (error) {
    //   console.log('Error playing audio: ', error);
    // }
    // console.log('Stopped recording..');

  }

  // React.useEffect(() => {
  //   const playAudio = async () => {
  //     const soundObject = new Audio.Sound();
  //     try {
  //       console.log(`\n ------- trying  ------- \n`);
  //       await soundObject.loadAsync({ uri: recordedAudio });
  //       console.log(`\n ------- playing...  ------- \n`);
  //       await soundObject.playAsync();
  //       console.log('Playing audio..');
  //     } catch (error) {
  //       console.log('Error playing audio: ', error);
  //     }
  //     console.log('Finished audio..');
  //   }
  
  //   playAudio();
  // }, [recordedAudio]);
  

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