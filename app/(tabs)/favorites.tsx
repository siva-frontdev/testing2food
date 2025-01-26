import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const favoriteRestaurants = [
  {
    id: '1',
    name: 'Pizza Palace',
    image: 'https://example.com/pizza.jpg',
    rating: 4.8,
    cuisine: 'Italian',
    deliveryTime: '25-30 min',
    distance: '1.2 km',
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Burger Hub',
    image: 'https://example.com/burger.jpg',
    rating: 4.5,
    cuisine: 'American',
    deliveryTime: '20-25 min',
    distance: '0.8 km',
    isFavorite: true,
  },
  // Add more restaurants...
];

export default function FavoritesScreen() {
  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <LinearGradient colors={['#FF6B00', '#FF8C3B']} style={styles.header}>
          <ThemedText style={styles.headerTitle}>Favorite Restaurants</ThemedText>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {favoriteRestaurants.map((restaurant, index) => (
            <MotiView
              key={restaurant.id}
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100 }}
            >
              <TouchableOpacity
                style={styles.restaurantCard}
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
              >
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => {
                    // Toggle favorite status
                  }}
                >
                  <Ionicons name="heart" size={24} color="#FF6B00" />
                </TouchableOpacity>

                <View style={styles.restaurantInfo}>
                  <View style={styles.nameRow}>
                    <ThemedText style={styles.restaurantName}>{restaurant.name}</ThemedText>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <ThemedText style={styles.rating}>{restaurant.rating}</ThemedText>
                    </View>
                  </View>

                  <ThemedText style={styles.cuisine}>{restaurant.cuisine}</ThemedText>

                  <View style={styles.detailsRow}>
                    <View style={styles.detail}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <ThemedText style={styles.detailText}>{restaurant.deliveryTime}</ThemedText>
                    </View>
                    <View style={styles.detail}>
                      <Ionicons name="location-outline" size={16} color="#666" />
                      <ThemedText style={styles.detailText}>{restaurant.distance}</ThemedText>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>
          ))}
        </ScrollView>
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
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  restaurantCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantInfo: {
    padding: 15,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB800',
  },
  cuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
}); 