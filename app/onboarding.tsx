import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Discover Amazing Food',
    description: 'Find the best restaurants and food around you with our curated selection',
    animation: require('@/assets/animations/lottie.json'),
    gradient: ['#FF6B6B', '#FF8E53']
  },
  {
    id: '2',
    title: 'Quick Delivery',
    description: 'Get your favorite food delivered to your doorstep in minutes',
    animation: require('@/assets/animations/lottie.json'),
    gradient: ['#4CAF50', '#2E7D32']
  },
  {
    id: '3',
    title: 'Easy Payment',
    description: 'Pay securely with multiple payment options available',
    animation: require('@/assets/animations/lottie.json'),
    gradient: ['#2196F3', '#1976D2']
  }
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/auth/login');
    }
  };

  const Paginator = () => {
    return (
      <View style={styles.paginatorContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={[styles.dot, { width: dotWidth, opacity }]}
              key={index}
            />
          );
        })}
      </View>
    );
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <FlatList
          data={slides}
          renderItem={({ item, index }) => (
            <LinearGradient
              colors={item.gradient}
              style={styles.slide}
            >
              <View style={styles.animationContainer}>
                <LottieView
                  source={item.animation}
                  autoPlay
                  loop
                  style={styles.animation}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </LinearGradient>
          )}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
          scrollEventThrottle={32}
        />
        <View style={styles.bottomContainer}>
          <Paginator />
          <TouchableOpacity
            style={styles.button}
            onPress={scrollTo}
          >
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  animation: {
    width: width * 0.8,
    height: width * 0.8,
  },
  textContainer: {
    flex: 0.3,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  paginatorContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
}); 