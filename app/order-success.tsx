import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';

export default function OrderSuccessScreen() {
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 1000 }}
          style={styles.content}
        >
          <LottieView
            source={require('@/assets/animations/lottie.json')}
            autoPlay
            loop={false}
            style={styles.animation}
          />
          <ThemedText style={styles.title}>Order Placed!</ThemedText>
          <ThemedText style={styles.message}>
            Your order has been successfully placed and will be delivered soon.
          </ThemedText>
          <ThemedText style={styles.orderNumber}>Order #12345</ThemedText>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => router.push('/order/12345')}
            >
              <ThemedText style={styles.trackButtonText}>Track Order</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <ThemedText style={styles.homeButtonText}>Back to Home</ThemedText>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  orderNumber: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  trackButton: {
    backgroundColor: '#FF6B00',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  homeButtonText: {
    color: '#FF6B00',
    fontSize: 18,
    fontWeight: '600',
  },
}); 