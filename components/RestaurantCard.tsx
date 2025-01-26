import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface RestaurantCardProps {
  name: string;
  rating: number;
  image: string;
  cuisine: string;
  deliveryTime: string;
  distance: string;
  onPress?: () => void;
}

export function RestaurantCard({
  name,
  rating,
  image,
  cuisine,
  deliveryTime,
  distance,
  onPress,
}: RestaurantCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 500 }}
    >
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.name}>{name}</ThemedText>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <ThemedText style={styles.ratingText}>{rating}</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.cuisine}>{cuisine}</ThemedText>
          <View style={styles.footer}>
            <View style={styles.info}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <ThemedText style={styles.infoText}>{deliveryTime}</ThemedText>
            </View>
            <View style={styles.info}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <ThemedText style={styles.infoText}>{distance}</ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  content: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFB800',
  },
  cuisine: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
}); 