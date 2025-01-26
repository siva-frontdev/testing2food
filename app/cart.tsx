import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { useCart } from '@/contexts/CartContext';

export default function CartScreen() {
  const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 1000 }}
        >
          <Ionicons name="cart-outline" size={100} color="#CCC" />
          <ThemedText style={styles.emptyText}>Your cart is empty</ThemedText>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.browseButtonText}>Browse Restaurants</ThemedText>
          </TouchableOpacity>
        </MotiView>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>My Cart</ThemedText>
          <TouchableOpacity onPress={clearCart}>
            <ThemedText style={styles.clearText}>Clear</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.itemsContainer}>
          {items.map((item, index) => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 100 }}
            >
              <View style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                  <ThemedText style={styles.restaurantName}>
                    {item.restaurantName}
                  </ThemedText>
                  <ThemedText style={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </ThemedText>
                </View>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item.id, item.quantity - 1);
                      } else {
                        removeItem(item.id);
                      }
                    }}
                  >
                    <Ionicons name="remove" size={20} color="#FF6B00" />
                  </TouchableOpacity>
                  <ThemedText style={styles.quantity}>{item.quantity}</ThemedText>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={20} color="#FF6B00" />
                  </TouchableOpacity>
                </View>
              </View>
            </MotiView>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <ThemedText style={styles.totalText}>Total</ThemedText>
            <ThemedText style={styles.totalAmount}>
              ${totalAmount.toFixed(2)}
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <ThemedText style={styles.checkoutText}>Proceed to Checkout</ThemedText>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearText: {
    color: '#FF6B00',
    fontSize: 16,
  },
  itemsContainer: {
    flex: 1,
    padding: 15,
  },
  cartItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B00',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 5,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 15,
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 20,
    paddingBottom: 35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    color: '#666',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  checkoutButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 