import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CustomSplashScreen() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#FF416C', '#FF4B2B']}
        style={styles.gradient}
      >
        <LottieView
          ref={lottieRef}
          source={require('@/assets/animations/lottie.json')}
          autoPlay
          loop={false}
          style={styles.animation}
          onAnimationFinish={() => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start();
          }}
        />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
}); 