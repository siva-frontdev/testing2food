import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type OrderStatus = 'confirmed' | 'preparing' | 'on_the_way' | 'delivered';

const statusSteps = [
  {
    id: 'confirmed',
    title: 'Order Confirmed',
    description: 'Your order has been received',
    icon: 'checkmark-circle',
  },
  {
    id: 'preparing',
    title: 'Preparing',
    description: 'Chef is preparing your food',
    icon: 'restaurant',
  },
  {
    id: 'on_the_way',
    title: 'On the Way',
    description: 'Your food is on the way',
    icon: 'bicycle',
  },
  {
    id: 'delivered',
    title: 'Delivered',
    description: 'Enjoy your meal!',
    icon: 'home',
  },
];

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('confirmed');
  const [estimatedTime, setEstimatedTime] = useState(30);

  // Simulate order status updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStatus((prev) => {
        switch (prev) {
          case 'confirmed':
            return 'preparing';
          case 'preparing':
            return 'on_the_way';
          case 'on_the_way':
            return 'delivered';
          default:
            return prev;
        }
      });
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentStatus === 'on_the_way') {
      const timer = setInterval(() => {
        setEstimatedTime((prev) => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStatus]);

  const getStatusIndex = (status: OrderStatus) => {
    return statusSteps.findIndex((step) => step.id === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <LinearGradient colors={['#FF6B00', '#FF8C3B']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Track Order</ThemedText>
            <View style={{ width: 24 }} />
          </View>
        </LinearGradient>

        <MotiView style={styles.trackingContainer}>
          <View style={styles.estimatedTime}>
            <ThemedText style={styles.timeText}>
              {estimatedTime} min
            </ThemedText>
            <ThemedText style={styles.timeLabel}>
              Estimated Delivery Time
            </ThemedText>
          </View>

          <View style={styles.progressContainer}>
            {statusSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <MotiView
                  from={{ scale: 0.5, opacity: 0 }}
                  animate={{
                    scale: index <= currentIndex ? 1 : 0.5,
                    opacity: index <= currentIndex ? 1 : 0.5,
                  }}
                  transition={{ type: 'timing', duration: 500 }}
                  style={styles.stepContainer}
                >
                  <View
                    style={[
                      styles.stepIcon,
                      index <= currentIndex && styles.activeStepIcon,
                    ]}
                  >
                    <Ionicons
                      name={step.icon as any}
                      size={24}
                      color={index <= currentIndex ? '#FFF' : '#666'}
                    />
                  </View>
                  <View style={styles.stepTextContainer}>
                    <ThemedText
                      style={[
                        styles.stepTitle,
                        index <= currentIndex && styles.activeStepTitle,
                      ]}
                    >
                      {step.title}
                    </ThemedText>
                    <ThemedText style={styles.stepDescription}>
                      {step.description}
                    </ThemedText>
                  </View>
                </MotiView>
                {index < statusSteps.length - 1 && (
                  <View
                    style={[
                      styles.progressLine,
                      index < currentIndex && styles.activeProgressLine,
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>

          <TouchableOpacity style={styles.supportButton}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#FF6B00" />
            <ThemedText style={styles.supportButtonText}>
              Need Support?
            </ThemedText>
          </TouchableOpacity>
        </MotiView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  trackingContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 20,
  },
  estimatedTime: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    marginBottom: 30,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activeStepIcon: {
    backgroundColor: '#FF6B00',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  activeStepTitle: {
    color: '#333',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
  },
  progressLine: {
    position: 'absolute',
    left: 24,
    top: 48,
    width: 2,
    height: 30,
    backgroundColor: '#F5F5F5',
  },
  activeProgressLine: {
    backgroundColor: '#FF6B00',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  supportButtonText: {
    fontSize: 16,
    color: '#FF6B00',
    marginLeft: 10,
    fontWeight: '600',
  },
}); 