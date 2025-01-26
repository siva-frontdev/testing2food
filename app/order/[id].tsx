import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { router, useLocalSearchParams } from 'expo-router';

const orderDetails = {
  id: '1',
  restaurant: 'Pizza Palace',
  date: '2024-02-20',
  status: 'Delivered',
  items: [
    { name: 'Pepperoni Pizza', quantity: 1, price: 18.99 },
    { name: 'Garlic Bread', quantity: 2, price: 3.50 },
  ],
  subtotal: 25.99,
  deliveryFee: 2.99,
  total: 28.98,
  deliveryAddress: '123 Main St, City, State 12345',
  deliveryTime: '30-40 min',
  orderNumber: '#ORD-12345',
};

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Order Details</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', duration: 1000 }}
          >
            <View style={styles.orderInfo}>
              <View style={styles.orderHeader}>
                <View>
                  <ThemedText style={styles.orderNumber}>{orderDetails.orderNumber}</ThemedText>
                  <ThemedText style={styles.date}>
                    {new Date(orderDetails.date).toLocaleDateString()}
                  </ThemedText>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: orderDetails.status === 'Delivered' ? '#4CAF50' : '#FF9800' }
                ]}>
                  <ThemedText style={styles.statusText}>{orderDetails.status}</ThemedText>
                </View>
              </View>

              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Restaurant</ThemedText>
                <ThemedText style={styles.restaurantName}>{orderDetails.restaurant}</ThemedText>
              </View>

              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Delivery Address</ThemedText>
                <ThemedText style={styles.address}>{orderDetails.deliveryAddress}</ThemedText>
              </View>

              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
                {orderDetails.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <ThemedText style={styles.itemQuantity}>{item.quantity}x</ThemedText>
                      <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                    </View>
                    <ThemedText style={styles.itemPrice}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </ThemedText>
                  </View>
                ))}
              </View>

              <View style={styles.totalSection}>
                <View style={styles.totalRow}>
                  <ThemedText style={styles.totalLabel}>Subtotal</ThemedText>
                  <ThemedText style={styles.totalValue}>${orderDetails.subtotal}</ThemedText>
                </View>
                <View style={styles.totalRow}>
                  <ThemedText style={styles.totalLabel}>Delivery Fee</ThemedText>
                  <ThemedText style={styles.totalValue}>${orderDetails.deliveryFee}</ThemedText>
                </View>
                <View style={[styles.totalRow, styles.finalTotal]}>
                  <ThemedText style={styles.totalLabel}>Total</ThemedText>
                  <ThemedText style={styles.grandTotal}>${orderDetails.total}</ThemedText>
                </View>
              </View>
            </View>
          </MotiView>
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
  orderInfo: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    color: '#333',
  },
  address: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B00',
    marginRight: 8,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#333',
  },
  totalSection: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 15,
    marginTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    color: '#333',
  },
  finalTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  grandTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
}); 