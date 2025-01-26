import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FoodCard } from '@/components/FoodCard';
import { RestaurantCard } from '@/components/RestaurantCard';
import { CategoryList } from '@/components/CategoryList';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { MotiView } from 'moti';
import { FloatingCartButton } from '@/components/FloatingCartButton';
import { useRouter } from 'expo-router';

type SortOption = 'popular' | 'price_low' | 'price_high' | 'rating';

const sortOptions: { id: SortOption; name: string; icon: string }[] = [
  { id: 'popular', name: 'Popular', icon: 'flame-outline' },
  { id: 'price_low', name: 'Price: Low to High', icon: 'arrow-down-outline' },
  { id: 'price_high', name: 'Price: High to Low', icon: 'arrow-up-outline' },
  { id: 'rating', name: 'Top Rated', icon: 'star-outline' },
];

const categories = [
  { id: 'all', name: 'All', icon: 'grid-outline' },
  { id: 'indian', name: 'Indian', icon: 'restaurant-outline' },
  { id: 'italian', name: 'Italian', icon: 'pizza-outline' },
  { id: 'japanese', name: 'Japanese', icon: 'fish-outline' },
  { id: 'chinese', name: 'Chinese', icon: 'nutrition-outline' },
  { id: 'desserts', name: 'Desserts', icon: 'ice-cream-outline' },
];

const popularFoods = [
  {
    id: '1',
    name: 'Chicken Biryani',
    price: 12.99,
    image: 'https://example.com/biryani.jpg',
    rating: 4.5,
    restaurant: 'Spice Paradise',
    restaurant_id: 'spice-paradise',
    description: 'Aromatic basmati rice cooked with tender chicken and exotic spices',
    category: 'indian',
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    price: 14.99,
    image: 'https://example.com/pizza.jpg',
    rating: 4.8,
    restaurant: 'Pizza Palace',
    restaurant_id: 'pizza-palace',
    description: 'Classic pizza with fresh tomatoes, mozzarella, and basil',
    category: 'italian',
  },
  {
    id: '3',
    name: 'Sushi Roll',
    price: 16.99,
    image: 'https://example.com/sushi.jpg',
    rating: 4.7,
    restaurant: 'Sushi Master',
    restaurant_id: 'sushi-master',
    description: 'Fresh salmon and avocado roll with premium rice',
    category: 'japanese',
  },
  {
    id: '4',
    name: 'Kung Pao Chicken',
    price: 13.99,
    image: 'https://example.com/kungpao.jpg',
    rating: 4.6,
    restaurant: 'Dragon Wok',
    restaurant_id: 'dragon-wok',
    description: 'Spicy diced chicken with peanuts and vegetables',
    category: 'chinese',
  },
  {
    id: '5',
    name: 'Tiramisu',
    price: 7.99,
    image: 'https://example.com/tiramisu.jpg',
    rating: 4.9,
    restaurant: 'Dolce Vita',
    restaurant_id: 'dolce-vita',
    description: 'Classic Italian dessert with coffee and mascarpone',
    category: 'desserts',
  },
];

const nearbyRestaurants = [
  {
    id: '1',
    name: 'Pizza Palace',
    rating: 4.8,
    image: 'https://example.com/restaurant1.jpg',
    cuisine: 'Italian',
    deliveryTime: '25-30 min',
    distance: '1.2 km',
  },
  {
    id: '2',
    name: 'Burger Hub',
    rating: 4.6,
    image: 'https://example.com/restaurant2.jpg',
    cuisine: 'American',
    deliveryTime: '20-25 min',
    distance: '0.8 km',
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showSortModal, setShowSortModal] = useState(false);
  const router = useRouter();

  const filteredFoods = popularFoods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const filteredRestaurants = nearbyRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const sortedAndFilteredFoods = filteredFoods.sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleFoodPress = (restaurantId: string) => {
    router.push({
      pathname: '/restaurant/[id]',
      params: { id: restaurantId }
    });
  };

  const handleRestaurantPress = (restaurantId: string) => {
    router.push({
      pathname: '/restaurant/[id]',
      params: { id: restaurantId }
    });
  };

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSortModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowSortModal(false)}
      >
        <MotiView
          from={{ translateY: 200, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          style={styles.sortModal}
        >
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Sort By</ThemedText>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sortOption,
                sortBy === option.id && styles.selectedSortOption,
              ]}
              onPress={() => {
                setSortBy(option.id);
                setShowSortModal(false);
              }}
            >
              <Ionicons
                name={option.icon as any}
                size={20}
                color={sortBy === option.id ? '#FF6B00' : '#666'}
              />
              <ThemedText
                style={[
                  styles.sortOptionText,
                  sortBy === option.id && styles.selectedSortOptionText,
                ]}
              >
                {option.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </MotiView>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient colors={['#FF6B00', '#FF8C3B']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.greeting}>Hello, {user?.displayName}</ThemedText>
            <ThemedText style={styles.subtitle}>What would you like to eat?</ThemedText>
          </View>
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'timing', duration: 500 }}
          >
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
              <Image
                source={{ uri: user?.photoURL || 'https://ui-avatars.com/api/?name=' + user?.displayName }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </MotiView>
        </View>
      </LinearGradient>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#666" />
          <TextInput
            placeholder="Search for food or restaurants"
            style={styles.searchInput}
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterSection}>
          <CategoryList
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <Ionicons name="options-outline" size={20} color="#666" />
            <ThemedText style={styles.sortButtonText}>
              {sortOptions.find(opt => opt.id === sortBy)?.name}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Popular Now 🔥</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.foodList}>
            {sortedAndFilteredFoods.map((food, index) => (
              <MotiView
                key={food.id}
                from={{ opacity: 0, translateX: 50 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: index * 100 }}
                style={styles.foodCardContainer}
              >
                <FoodCard
                  name={food.name}
                  price={food.price}
                  image={food.image}
                  rating={food.rating}
                  restaurant={food.restaurant}
                  description={food.description}
                  onPress={() => handleFoodPress(food.restaurant_id)}
                />
              </MotiView>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Nearby Restaurants</ThemedText>
          {filteredRestaurants.map((restaurant, index) => (
            <MotiView
              key={restaurant.id}
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100 }}
            >
              <RestaurantCard
                name={restaurant.name}
                rating={restaurant.rating}
                image={restaurant.image}
                cuisine={restaurant.cuisine}
                deliveryTime={restaurant.deliveryTime}
                distance={restaurant.distance}
                onPress={() => handleRestaurantPress(restaurant.id)}
              />
            </MotiView>
          ))}
        </View>
      </ScrollView>
      <FloatingCartButton />
      {renderSortModal()}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 20,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  foodList: {
    paddingHorizontal: 5,
  },
  foodCardContainer: {
    marginHorizontal: 10,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sortButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sortModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  selectedSortOption: {
    backgroundColor: '#FFF9E6',
  },
  sortOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666',
  },
  selectedSortOptionText: {
    color: '#FF6B00',
    fontWeight: '600',
  },
});
