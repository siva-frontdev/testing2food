import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { router, useLocalSearchParams } from 'expo-router';
import { useCart } from '@/contexts/CartContext';
import { LinearGradient } from 'expo-linear-gradient';

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 90;

const menuCategories = [
  { id: '1', name: 'Popular' },
  { id: '2', name: 'Starters' },
  { id: '3', name: 'Main Course' },
  { id: '4', name: 'Desserts' },
  { id: '5', name: 'Beverages' },
];

const menuItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 12.99,
    image: 'https://example.com/pizza.jpg',
    category: '1',
  },
  {
    id: '2',
    name: 'Garlic Bread',
    description: 'Freshly baked bread with garlic butter and herbs',
    price: 4.99,
    image: 'https://example.com/bread.jpg',
    category: '2',
  },
  // Add more items...
];

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('1');
  const scrollY = new Animated.Value(0);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <Animated.Image
            source={{ uri: 'https://example.com/restaurant-cover.jpg' }}
            style={[styles.coverImage, { opacity: imageOpacity }]}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent']}
            style={styles.gradient}
          />
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Animated.View
              style={[styles.headerTitle, { opacity: headerTitleOpacity }]}
            >
              <ThemedText style={styles.headerTitleText}>Pizza Palace</ThemedText>
            </Animated.View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.ScrollView
          style={styles.scrollView}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.restaurantInfo}>
            <ThemedText style={styles.restaurantName}>Pizza Palace</ThemedText>
            <View style={styles.ratingRow}>
              <View style={styles.rating}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <ThemedText style={styles.ratingText}>4.8</ThemedText>
              </View>
              <ThemedText style={styles.cuisine}>Italian • $$</ThemedText>
              <ThemedText style={styles.timing}>25-30 min</ThemedText>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {menuCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <ThemedText
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.selectedCategoryText,
                  ]}
                >
                  {category.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.menuContainer}>
            {menuItems
              .filter((item) => item.category === selectedCategory)
              .map((item, index) => (
                <MotiView
                  key={item.id}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: index * 100 }}
                >
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() =>
                      addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        restaurantId: id as string,
                        restaurantName: 'Pizza Palace',
                      })
                    }
                  >
                    <View style={styles.menuItemInfo}>
                      <ThemedText style={styles.menuItemName}>{item.name}</ThemedText>
                      <ThemedText style={styles.menuItemDescription}>
                        {item.description}
                      </ThemedText>
                      <ThemedText style={styles.menuItemPrice}>
                        ${item.price.toFixed(2)}
                      </ThemedText>
                    </View>
                    <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                  </TouchableOpacity>
                </MotiView>
              ))}
          </View>
        </Animated.ScrollView>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 60,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    marginTop: HEADER_MIN_HEIGHT,
  },
  restaurantInfo: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB800',
  },
  cuisine: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  timing: {
    fontSize: 14,
    color: '#666',
  },
  categoriesContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#F5F5F5',
  },
  selectedCategory: {
    backgroundColor: '#FF6B00',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#FFF',
    fontWeight: '600',
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 15,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B00',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
}); 