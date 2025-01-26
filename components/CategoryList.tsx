import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { ThemedText } from './ThemedText';

interface CategoryListProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All', icon: 'grid-outline' },
  { id: 'indian', name: 'Indian', icon: 'restaurant-outline' },
  { id: 'italian', name: 'Italian', icon: 'pizza-outline' },
  { id: 'japanese', name: 'Japanese', icon: 'fish-outline' },
  { id: 'chinese', name: 'Chinese', icon: 'nutrition-outline' },
  { id: 'desserts', name: 'Desserts', icon: 'ice-cream-outline' },
];

export function CategoryList({ selectedCategory, onSelectCategory }: CategoryListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {categories.map((category, index) => (
        <MotiView
          key={category.id}
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 100 }}
        >
          <TouchableOpacity
            style={[
              styles.category,
              selectedCategory === category.id && styles.selectedCategory,
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            <View
              style={[
                styles.iconContainer,
                selectedCategory === category.id && styles.selectedIconContainer,
              ]}
            >
              <Ionicons
                name={category.icon as any}
                size={24}
                color={selectedCategory === category.id ? '#FFF' : '#666'}
              />
            </View>
            <ThemedText
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText,
              ]}
            >
              {category.name}
            </ThemedText>
          </TouchableOpacity>
        </MotiView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  category: {
    alignItems: 'center',
    marginRight: 20,
  },
  selectedCategory: {
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedIconContainer: {
    backgroundColor: '#FF6B00',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#FF6B00',
    fontWeight: '600',
  },
}); 