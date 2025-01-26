import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { ThemedText } from './ThemedText';
import { useCart } from '@/contexts/CartContext';

interface AddToCartButtonProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    restaurantId: string;
    restaurantName: string;
  };
}

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    addItem(item);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={handleAddToCart}
      >
        <Ionicons name="add" size={20} color="#FFF" />
        <ThemedText style={styles.buttonText}>Add to Cart</ThemedText>
      </TouchableOpacity>

      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={styles.successMessage}
          >
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <ThemedText style={styles.successText}>Added to Cart!</ThemedText>
          </MotiView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
}); 