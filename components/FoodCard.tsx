import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { AddToCartButton } from './AddToCartButton';

interface FoodCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  restaurant: string;
  restaurantId: string;
  description?: string;
  onPress?: () => void;
}

export function FoodCard({
  id,
  name,
  price,
  image,
  rating,
  restaurant,
  restaurantId,
  description,
  onPress,
}: FoodCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
    >
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.content}>
          <ThemedText style={styles.name}>{name}</ThemedText>
          <ThemedText style={styles.restaurant}>{restaurant}</ThemedText>
          {description && (
            <ThemedText numberOfLines={2} style={styles.description}>
              {description}
            </ThemedText>
          )}
          <View style={styles.footer}>
            <ThemedText style={styles.price}>${price.toFixed(2)}</ThemedText>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <ThemedText style={styles.ratingText}>{rating}</ThemedText>
            </View>
          </View>
        </View>
        <AddToCartButton
          item={{
            id,
            name,
            price,
            image,
            restaurantId,
            restaurantName: restaurant,
          }}
        />
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginRight: 15,
    width: 200,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurant: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B00',
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
}); 