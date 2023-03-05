import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import { Svg, Rect } from 'react-native-svg';
import LottieWaveForm from "./assets/lottie-waveform";
import LottieBlack from "./assets/lottie-black";


// import * as React from 'react';
import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [recording, setRecording] = useState();
  const [waveform, setWaveform] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState();
  const [playing, setPlaying] = useState(false);


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

  async function playRecordedAudio() {
    setPlaying(true);
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
        const fileInfo = await FileSystem.getInfoAsync("/Users/kevinbuhler/Code/audiogpt/api/abc.mp3");
        if (fileInfo.exists) {
          await soundObject.loadAsync({ uri: fileInfo.uri });
          // const waveform = await soundObject.getWaveFormAsync({
          //   size: 1024, // Number of samples to analyze at once
          //   width: 500, // Width of the waveform image
          //   height: 200, // Height of the waveform image
          // });
          // setWaveform(waveform);
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
    setRecordedAudio(undefined);
    setPlaying(false);
  }

  function Visualizer({ waveform }) {
    return (
      <Svg width={waveform.width} height={waveform.height}>
        {waveform.data.map((amplitude, index) => (
          <Rect
            key={index}
            x={index}
            y={0}
            width={1}
            height={amplitude}
            fill="blue"
          />
        ))}
      </Svg>
    );
  }

  return (
    <View style={tw`mx-auto py-16 flex flex-col`}>
      {/* <View style={tw`pt-8 text-xl`}>
        <Text>AUDIOxGPT</Text>
      </View> */}
      <Text style={tw`font-bold text-3xl mt-auto mx-auto mb-16`}>AUDIOxGPT</Text>
      
      {/* PLAY AUDIO */}
      

      {/* SETTINGS BUTTON */}
      {/* <View style={tw`bg-red-500 `}>
        <Text>AUDIOxGPT</Text>
      </View> */}
      {/* <View style={styles.settings}>

        <Ionicons name="settings-outline" size={36} color="white" style={styles.settingsIcon}/>
      </View> */}

  

      {/* MMMMM BLOB */}
      {/* WILL LIKELY DO THIS VIA JS AND CSS */}
      <View style={tw` rounded py-4 mx-auto`}>
        {/* <Text style={tw`font-bold m-auto `}>BLOB</Text> */}
        {recording && (<LottieWaveForm />)}
        {!recording && !recordedAudio && (<LottieBlack/>)}
        {!recording && recordedAudio && (<LottieBlack />)}
        {/* <LottieWaveForm /> */}
        
      </View>
  
      {/* RECORD BUTTON */}
      {/* <View style={styles.buttonCustom}>
        <Image source={'/assets/button.png'}/> 
      </View> */}

      {/* SECOND BUTTON AS WELL??? */}
      <View style={tw`my-4  mx-auto`}>
        {/* <Button
          title={recording ? 'Stop Recording' : 'Start Recording'}
          onPress={recording ? stopRecording : startRecording}
        /> */}

        {!recordedAudio && (
         <TouchableOpacity 
          title={recording ? 'Stop Recording' : 'Start Recording'}
          onPress={recording ? stopRecording : startRecording}>  
          <Text style={tw`m-4  font-bold text-xl`}>
            {recording ? "RECORDING IN PROGRESS" : ""} 
          </Text>
          {/* START RECORDING BUTTON */}
          {/* <MaterialCommunityIcons name="record-rec" size={80} color="white" /> */}
          <Entypo style={tw`m-4 mx-auto`} name="circle" size={72} color="#000" />
        </TouchableOpacity>
        )}

        {/* STOP RECORDING BUTTON */}
        {/* <Ionicons name="md-stop-circle-outline" size={72} color="white" /> */}

        {/* PLAY RECORDED AUDIO */}
        {recordedAudio && !playing && (
        <TouchableOpacity title="Play Recorded Audio" onPress={playRecordedAudio}>
          <Text style={tw`m-4 font-bold text-xl`}>
            {recording && recordedAudio ? "" : "AUDIO PROCESSED"} 
          </Text>
          <Entypo style={tw`m-4 mx-auto`} name="controller-play" size={72} color="#000" />
        </TouchableOpacity>
         )}

        

      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // uwotm8: {
  //   flex: 1,
  //   color: 'white',
  //   justifyContent: 'center',
  // },
  // settings: {
  //   flex: 1,
  //   alignSelf: 'stretch',
  //   backgroundColor: '#10041E',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // settingsIcon: {
  //   alignSelf: 'flex-end',
  //   padding: 20,
  // },

  // blob: {
  //   alignSelf: 'stretch',
  //   flex: 5,
  //   backgroundColor: '#2e0b56',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  // buttonRecord: {
  //   alignSelf: 'stretch',
  //   flex: 2,
  //   backgroundColor: '#10041E',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
});





