import React from "react";
import LottieView from "lottie-react-native";

export default class LottieBlack extends React.Component {
  render() {
    return (
      <LottieView
        source={require("app/assets/120096-ai-assistant-animation.json")}
        
        style={{ width: 400, height: 400 }}
        autoPlay
      />
    );
  }
}