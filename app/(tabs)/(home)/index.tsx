
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { PhoneNumber } from '@/types/PhoneNumber';
import { IconSymbol } from '@/components/IconSymbol';
import WarningModal from '@/components/WarningModal';

export default function HomeScreen() {
  const { availableNumbers, addToCart, cart } = useApp();
  const [showPortoutModal, setShowPortoutModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasSeenWarnings, setHasSeenWarnings] = useState(false);

  useEffect(() => {
    // Show warnings on app open
    if (!hasSeenWarnings) {
      setShowPortoutModal(true);
    }
  }, []);

  const handlePortoutModalClose = () => {
    setShowPortoutModal(false);
    // Show payment modal after first modal
    setTimeout(() => {
      setShowPaymentModal(true);
    }, 300);
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    setHasSeenWarnings(true);
  };

  const handleAddToCart = (number: PhoneNumber) => {
    const isInCart = cart.some(item => item.phoneNumber.id === number.id);
    if (!isInCart) {
      addToCart(number);
    }
  };

  const renderNumberCard = ({ item }: { item: PhoneNumber }) => {
    if (item.status !== 'available') return null;

    const isInCart = cart.some(cartItem => cartItem.phoneNumber.id === item.id);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.phoneNumberContainer}>
            <IconSymbol name="phone.fill" size={24} color={colors.primary} />
            <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
          </View>
          <Text style={styles.price}>${item.price}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.hiddenInfo}>
            Account &amp; PIN hidden until purchase
          </Text>
          <Pressable
            style={[styles.addButton, isInCart && styles.addButtonDisabled]}
            onPress={() => handleAddToCart(item)}
            disabled={isInCart}
          >
            <Text style={styles.addButtonText}>
              {isInCart ? 'In Cart' : 'Add to Cart'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const availableForPurchase = availableNumbers.filter(n => n.status === 'available');

  return (
    <>
      <Stack.Screen
        options={{
          title: 'EZ Ports Farm',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Available Port Numbers</Text>
          <Text style={styles.headerSubtitle}>
            {availableForPurchase.length} numbers available
          </Text>
        </View>

        <FlatList
          data={availableForPurchase}
          renderItem={renderNumberCard}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.listContainer,
            Platform.OS !== 'ios' && styles.listContainerWithTabBar
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="phone.slash" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No numbers available</Text>
              <Text style={styles.emptySubtext}>Check back soon for new numbers!</Text>
            </View>
          }
        />

        <WarningModal
          visible={showPortoutModal}
          onClose={handlePortoutModalClose}
          type="portout"
        />
        <WarningModal
          visible={showPaymentModal}
          onClose={handlePaymentModalClose}
          type="payment"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hiddenInfo: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
