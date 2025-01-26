import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';

const orders = [
  {
    id: '1',
    restaurant: 'Pizza Palace',
    date: '2024-02-20',
    status: 'Delivered',
    items: ['Pepperoni Pizza', 'Garlic Bread'],
    total: 25.99,
  },
  {
    id: '2',
    restaurant: 'Burger King',
    date: '2024-02-18',
    status: 'Delivered',
    items: ['Whopper Meal', 'Onion Rings'],
    total: 18.50,
  },
  // Add more orders...
];

export default function OrdersScreen() {
  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>My Orders</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {orders.map((order, index) => (
            <MotiView
              key={order.id}
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100 }}
            >
              <TouchableOpacity
                style={styles.orderCard}
                onPress={() => router.push(`/order/${order.id}`)}
              >
                <View style={styles.orderHeader}>
                  <ThemedText style={styles.restaurantName}>
                    {order.restaurant}
                  </ThemedText>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: order.status === 'Delivered' ? '#4CAF50' : '#FF9800' }
                  ]}>
                    <ThemedText style={styles.statusText}>{order.status}</ThemedText>
                  </View>
                </View>

                <View style={styles.orderInfo}>
                  <ThemedText style={styles.orderDate}>
                    {new Date(order.date).toLocaleDateString()}
                  </ThemedText>
                  <ThemedText style={styles.orderItems}>
                    {order.items.join(', ')}
                  </ThemedText>
                  <View style={styles.orderTotal}>
                    <ThemedText style={styles.totalLabel}>Total:</ThemedText>
                    <ThemedText style={styles.totalAmount}>
                      ${order.total.toFixed(2)}
                    </ThemedText>
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
  orderCard: {
    backgroundColor: '#FFF',
    margin: 10,
    padding: 15,
    borderRadius: 12,
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
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  orderInfo: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderItems: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
}); 