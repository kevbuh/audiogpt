import React from "react";
import LottieView from "lottie-react-native";

export default class LottieBlack extends React.Component {
  render() {
    return (
      <LottieView
        speed={0.4}
        // source={require("app/assets/wfMURAhQQ6.json")}
        source={require("app/assets/120096-ai-assistant-animation.json")}

        
        // style={{ width: 200, height: 200 }}
        style={{ width: 400, height: 400 }}

        autoPlay
      />
    );
  }
}