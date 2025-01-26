import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type OrderStatus = 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

type SortOption = 'date_new' | 'date_old' | 'total_high' | 'total_low';

const orders = [
  {
    id: '1',
    restaurant: 'Pizza Palace',
    date: '2024-02-20',
    status: 'delivered' as OrderStatus,
    items: ['Pepperoni Pizza', 'Garlic Bread'],
    total: 25.99,
    orderNumber: 'ORD-12345',
  },
  {
    id: '2',
    restaurant: 'Burger King',
    date: '2024-02-20',
    status: 'on_the_way' as OrderStatus,
    items: ['Whopper Meal', 'Onion Rings'],
    total: 18.50,
    orderNumber: 'ORD-12346',
  },
  {
    id: '3',
    restaurant: 'Sushi Master',
    date: '2024-02-20',
    status: 'preparing' as OrderStatus,
    items: ['Sushi Roll', 'Miso Soup'],
    total: 32.99,
    orderNumber: 'ORD-12347',
  },
];

const statusFilters = [
  { id: 'all', label: 'All Orders' },
  { id: 'active', label: 'Active Orders' },
  { id: 'delivered', label: 'Past Orders' },
];

const sortOptions: { id: SortOption; name: string; icon: string }[] = [
  { id: 'date_new', name: 'Newest First', icon: 'calendar-outline' },
  { id: 'date_old', name: 'Oldest First', icon: 'calendar-outline' },
  { id: 'total_high', name: 'Highest Total', icon: 'trending-up-outline' },
  { id: 'total_low', name: 'Lowest Total', icon: 'trending-down-outline' },
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return '#FFB800';
    case 'preparing':
      return '#2196F3';
    case 'on_the_way':
      return '#FF6B00';
    case 'delivered':
      return '#4CAF50';
    case 'cancelled':
      return '#F44336';
    default:
      return '#666';
  }
};

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'time-outline';
    case 'preparing':
      return 'restaurant-outline';
    case 'on_the_way':
      return 'bicycle-outline';
    case 'delivered':
      return 'checkmark-circle-outline';
    case 'cancelled':
      return 'close-circle-outline';
    default:
      return 'ellipse-outline';
  }
};

export default function OrdersScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('date_new');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortModal, setShowSortModal] = useState(false);

  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesFilter = selectedFilter === 'all' ||
        (selectedFilter === 'active' && ['pending', 'preparing', 'on_the_way'].includes(order.status)) ||
        (selectedFilter === 'delivered' && ['delivered', 'cancelled'].includes(order.status));

      const matchesSearch = searchQuery === '' ||
        order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_new':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date_old':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'total_high':
          return b.total - a.total;
        case 'total_low':
          return a.total - b.total;
        default:
          return 0;
      }
    });

  // Group orders by date
  const groupedOrders = filteredAndSortedOrders.reduce((groups, order) => {
    const date = new Date(order.date);
    const dateKey = date.toISOString().split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(order);
    return groups;
  }, {} as Record<string, typeof orders>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
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
                name={option.icon}
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
        <ThemedText style={styles.headerTitle}>My Orders</ThemedText>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#666" />
        <TextInput
          placeholder="Search orders..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.selectedFilter,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.selectedFilterText,
                ]}
              >
                {filter.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Ionicons name="options-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedOrders).map(([dateKey, dateOrders]) => (
          <View key={dateKey} style={styles.dateGroup}>
            <ThemedText style={styles.dateHeader}>
              {formatDate(dateKey)}
            </ThemedText>
            {dateOrders.map((order, index) => (
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
                    <View>
                      <ThemedText style={styles.restaurantName}>
                        {order.restaurant}
                      </ThemedText>
                      <ThemedText style={styles.orderNumber}>
                        {order.orderNumber}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.orderDate}>{order.date}</ThemedText>
                  </View>

                  <View style={styles.orderItems}>
                    <ThemedText style={styles.itemsText}>
                      {order.items.join(', ')}
                    </ThemedText>
                  </View>

                  <View style={styles.orderFooter}>
                    <View style={styles.statusContainer}>
                      <Ionicons
                        name={getStatusIcon(order.status)}
                        size={16}
                        color={getStatusColor(order.status)}
                      />
                      <ThemedText
                        style={[
                          styles.statusText,
                          { color: getStatusColor(order.status) },
                        ]}
                      >
                        {order.status.replace('_', ' ').toUpperCase()}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.totalText}>
                      ${order.total.toFixed(2)}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        ))}
      </ScrollView>
      {renderSortModal()}
    </>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderItems: {
    marginBottom: 10,
  },
  itemsText: {
    fontSize: 14,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4CAF50',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  filterContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  selectedFilter: {
    backgroundColor: '#FFF9E6',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  selectedFilterText: {
    color: '#FF6B00',
    fontWeight: '600',
  },
  orderNumber: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 20,
    marginBottom: 10,
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
    color: '#333',
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    marginLeft: 5,
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
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  sortButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginLeft: 10,
  },
}); 