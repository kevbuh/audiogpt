import React from "react";
import LottieView from "lottie-react-native";

export default class LottieWaveForm extends React.Component {
  render() {
    return (
      <LottieView
        source={require("app/assets/53476-siri.json")}
        style={{ width: 200, height: 100 }}
        autoPlay
      />
    );
  }
}