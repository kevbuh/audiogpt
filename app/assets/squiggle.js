import React from 'react';
import { View, Image } from 'react-native';

const MyComponent = () => {
  return (
    <View style={{ width: '10%' }}>
      <Image 
        source={require('app/assets/svgviewer-png-output.png')} 
        // style={{ width: 600, height: 100 }} 
        style={{ width: '100%' }}
        // style= {width: }
      />
    </View>
  );
};

export default MyComponent;
