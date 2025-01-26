import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { MotiView } from 'moti';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

const menuItems = [
  {
    id: '1',
    title: 'My Orders',
    icon: 'receipt-outline',
    route: '/orders',
  },
  {
    id: '2',
    title: 'Favorite Restaurants',
    icon: 'heart-outline',
    route: '/favorites',
  },
  {
    id: '3',
    title: 'Delivery Addresses',
    icon: 'location-outline',
    route: '/addresses',
  },
  {
    id: '4',
    title: 'Payment Methods',
    icon: 'card-outline',
    route: '/payments',
  },
  {
    id: '5',
    title: 'Settings',
    icon: 'settings-outline',
    route: '/settings',
  },
];

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#FF6B00', '#FF8C3B']} style={styles.header}>
          <MotiView
            from={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 1000 }}
            style={styles.profileContainer}
          >
            <Image
              source={{ uri: user?.photoURL || 'https://ui-avatars.com/api/?name=' + user?.displayName }}
              style={styles.avatar}
            />
            <ThemedText style={styles.name}>{user?.displayName}</ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
          </MotiView>
        </LinearGradient>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 100 }}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push(item.route)}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={24} color="#FF6B00" />
                  <ThemedText style={styles.menuItemText}>{item.title}</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B00" />
          <ThemedText style={styles.logoutText}>Log Out</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
    marginTop: 5,
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6B00',
    marginLeft: 10,
    fontWeight: '600',
  },
}); 