import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { useCart } from '@/contexts/CartContext';
import { LinearGradient } from 'expo-linear-gradient';

const DELIVERY_FEE = 2.99;
const TAX_RATE = 0.08;

type CheckoutStep = 'delivery' | 'payment' | 'confirmation';

const addresses = [
  {
    id: '1',
    title: 'Home',
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    isDefault: true,
  },
  {
    id: '2',
    title: 'Work',
    address: '456 Office Plaza',
    city: 'New York',
    state: 'NY',
    isDefault: false,
  },
];

const paymentMethods = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    last4: '1234',
    brand: 'mastercard',
    isDefault: false,
  },
];

export default function CheckoutScreen() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery');
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const { items, totalAmount, clearCart } = useCart();

  const tax = totalAmount * TAX_RATE;
  const finalTotal = totalAmount + DELIVERY_FEE + tax;

  const handlePlaceOrder = async () => {
    try {
      // Here you would typically:
      // 1. Validate the order
      // 2. Process payment
      // 3. Create order in backend
      // 4. Clear cart
      clearCart();
      router.replace('/order-success');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {['delivery', 'payment', 'confirmation'].map((step, index) => (
        <React.Fragment key={step}>
          <View
            style={[
              styles.stepDot,
              currentStep === step && styles.activeStepDot,
              index < ['delivery', 'payment', 'confirmation'].indexOf(currentStep) && styles.completedStepDot,
            ]}
          />
          {index < 2 && <View style={styles.stepLine} />}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <LinearGradient colors={['#FF6B00', '#FF8C3B']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Checkout</ThemedText>
            <View style={{ width: 24 }} />
          </View>
          {renderStepIndicator()}
        </LinearGradient>

        <ScrollView style={styles.content}>
          {currentStep === 'delivery' && (
            <MotiView
              from={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
            >
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Delivery Address</ThemedText>
                {addresses.map((address) => (
                  <TouchableOpacity
                    key={address.id}
                    style={[
                      styles.addressCard,
                      selectedAddress.id === address.id && styles.selectedCard,
                    ]}
                    onPress={() => setSelectedAddress(address)}
                  >
                    <View style={styles.addressHeader}>
                      <ThemedText style={styles.addressTitle}>{address.title}</ThemedText>
                      {address.isDefault && (
                        <View style={styles.defaultBadge}>
                          <ThemedText style={styles.defaultText}>Default</ThemedText>
                        </View>
                      )}
                    </View>
                    <ThemedText style={styles.addressText}>{address.address}</ThemedText>
                    <ThemedText style={styles.addressText}>
                      {address.city}, {address.state}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </MotiView>
          )}

          {currentStep === 'payment' && (
            <MotiView
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
            >
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.paymentCard,
                      selectedPayment.id === method.id && styles.selectedCard,
                    ]}
                    onPress={() => setSelectedPayment(method)}
                  >
                    <Ionicons
                      name={method.brand === 'visa' ? 'card' : 'card-outline'}
                      size={24}
                      color="#FF6B00"
                    />
                    <View style={styles.paymentInfo}>
                      <ThemedText style={styles.paymentTitle}>
                        {method.brand.toUpperCase()} ****{method.last4}
                      </ThemedText>
                      {method.isDefault && (
                        <View style={styles.defaultBadge}>
                          <ThemedText style={styles.defaultText}>Default</ThemedText>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </MotiView>
          )}

          {currentStep === 'confirmation' && (
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
                {items.map((item) => (
                  <View key={item.id} style={styles.orderItem}>
                    <View style={styles.orderItemInfo}>
                      <ThemedText style={styles.orderItemQuantity}>
                        {item.quantity}x
                      </ThemedText>
                      <ThemedText style={styles.orderItemName}>{item.name}</ThemedText>
                    </View>
                    <ThemedText style={styles.orderItemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </MotiView>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <ThemedText style={styles.priceLabel}>Subtotal</ThemedText>
              <ThemedText style={styles.priceValue}>${totalAmount.toFixed(2)}</ThemedText>
            </View>
            <View style={styles.priceRow}>
              <ThemedText style={styles.priceLabel}>Delivery Fee</ThemedText>
              <ThemedText style={styles.priceValue}>${DELIVERY_FEE.toFixed(2)}</ThemedText>
            </View>
            <View style={styles.priceRow}>
              <ThemedText style={styles.priceLabel}>Tax</ThemedText>
              <ThemedText style={styles.priceValue}>${tax.toFixed(2)}</ThemedText>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <ThemedText style={styles.totalLabel}>Total</ThemedText>
              <ThemedText style={styles.totalValue}>${finalTotal.toFixed(2)}</ThemedText>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (currentStep === 'delivery') setCurrentStep('payment');
              else if (currentStep === 'payment') setCurrentStep('confirmation');
              else handlePlaceOrder();
            }}
          >
            <ThemedText style={styles.buttonText}>
              {currentStep === 'confirmation' ? 'Place Order' : 'Continue'}
            </ThemedText>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
    opacity: 0.5,
  },
  activeStepDot: {
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  completedStepDot: {
    opacity: 1,
    backgroundColor: '#4CAF50',
  },
  stepLine: {
    width: 50,
    height: 2,
    backgroundColor: '#FFF',
    opacity: 0.3,
    marginHorizontal: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  addressCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    borderColor: '#FF6B00',
    borderWidth: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  defaultBadge: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    color: '#FFB800',
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentInfo: {
    marginLeft: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  orderItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemQuantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B00',
    marginRight: 10,
  },
  orderItemName: {
    fontSize: 16,
    color: '#333',
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  priceBreakdown: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  button: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
}); 