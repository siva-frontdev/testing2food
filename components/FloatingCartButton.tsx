import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useCart } from '@/contexts/CartContext';
import { ThemedText } from './ThemedText';

export function FloatingCartButton() {
  const { totalItems, totalAmount } = useCart();

  if (totalItems === 0) return null;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 50 }}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/cart')}
      >
        <View style={styles.leftContent}>
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>{totalItems}</ThemedText>
          </View>
          <Ionicons name="cart" size={24} color="#FFF" />
        </View>
        <ThemedText style={styles.price}>${totalAmount.toFixed(2)}</ThemedText>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    minWidth: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeText: {
    color: '#FF6B00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 