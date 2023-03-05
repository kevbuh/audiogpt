import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { AudioRecorder, AudioUtils } from 'react-native-audio-recorder-player';

export default function AudioVisualizer() {
  const [fftAvgWin, setFftAvgWin] = useState(0);
  const [particleWorld, setParticleWorld] = useState([]);

  useEffect(() => {
    const audioRecorderPlayer = new AudioRecorder();
    audioRecorderPlayer.setSubscriptionDuration(0.05); // set subscription duration to 50ms
    audioRecorderPlayer.addRecordBackListener((e) => {
      const audioData = JSON.parse(e.data);
      const frequencyArray = audioData.data.map((d) => Math.abs(d)); // get absolute values of audio data
      const fftAvg = frequencyArray.reduce((fftv, t) => fftv + t) / 255;
      setFftAvgWin((prev) => (prev + fftAvg) / 2);
    });
    audioRecorderPlayer.startRecorder();

    const circleCount = 4;
    const initialParticleWorld = [];
    for (let i = 1; i <= circleCount; i++) {
      const initialRadius = circleCount / i;
      initialParticleWorld.push({
        particleId: i,
        alive: true,
        acceleration: i / circleCount,
        velocity: i / circleCount,
        radius: initialRadius,
        birth: new Date().getTime() - i * 100,
      });
    }
    setParticleWorld(initialParticleWorld);

    const animationInterval = setInterval(() => {
      const now = new Date().getTime();
      const updatedParticleWorld = particleWorld.map((particle, index) => {
        if (particle.alive) {
          if (particle.radius > 50) {
            particle.alive = false;
          }
          if (particle.birth < now - 1000) {
            particle.alive = false;
          }
        } else {
          particle.velocity = Math.min(fftAvgWin / 20, 0.9);
          particle.radius = 0;
          particle.alive = true;
          particle.birth = new Date().getTime() - index * 100; // to maintain randomness
        }
        particle.velocity -= 0.01;
        particle.radius += particle.velocity;
        return particle;
      });
      setParticleWorld(updatedParticleWorld);
    }, 50);

    return () => {
      clearInterval(animationInterval);
      audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
    };
  }, []);

  return (
    <View style={styles.container}>
      {particleWorld.map((particle) => (
        <View
          key={particle.particleId}
          style={[styles.circle, { width: particle.radius, height: particle.radius }]}
        />
      ))}
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
  circle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'blue',
    opacity: 0.2,
  },
});
