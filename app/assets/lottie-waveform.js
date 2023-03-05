import React from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";
import tw from 'twrnc';

export default class LottieWaveForm extends React.Component {
  render() {
    return (
      <View style={tw`mx-auto mb-54`} >
      <LottieView
        source={require("app/assets/53476-siri.json")}
        style={{ width: 200, height: 100, marginVertical:40 }}
        autoPlay
        />
      </View>
    );
  }
}