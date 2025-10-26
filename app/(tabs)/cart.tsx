
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Platform, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';
import WarningModal from '@/components/WarningModal';

export default function CartScreen() {
  const { cart, removeFromCart, clearCart, markAsPaid } = useApp();
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [showInboxModal, setShowInboxModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'initial' | 'pay' | 'paid'>('initial');

  const totalPrice = cart.reduce((sum, item) => sum + item.phoneNumber.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowPaymentInfo(true);
    setPaymentStep('pay');
  };

  const handlePay = () => {
    setPaymentStep('paid');
  };

  const handlePaid = () => {
    const numbers = cart.map(item => item.phoneNumber);
    markAsPaid(numbers);
    setShowPaymentInfo(false);
    setShowWaitingModal(true);
  };

  const handleWaitingModalClose = () => {
    setShowWaitingModal(false);
    setShowInboxModal(true);
  };

  const handleInboxModalClose = () => {
    setShowInboxModal(false);
    setPaymentStep('initial');
    router.push('/(tabs)/inbox');
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemHeader}>
        <View style={styles.phoneNumberContainer}>
          <IconSymbol name="phone.fill" size={20} color={colors.primary} />
          <Text style={styles.phoneNumber}>{item.phoneNumber.phoneNumber}</Text>
        </View>
        <Pressable onPress={() => removeFromCart(item.phoneNumber.id)}>
          <IconSymbol name="trash.fill" size={20} color={colors.highlight} />
        </Pressable>
      </View>
      <Text style={styles.price}>${item.phoneNumber.price}</Text>
    </View>
  );

  if (showPaymentInfo) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Payment',
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: '#FFFFFF',
            headerLeft: () => (
              <Pressable onPress={() => setShowPaymentInfo(false)} style={{ marginLeft: 16 }}>
                <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
              </Pressable>
            ),
          }}
        />
        <ScrollView style={commonStyles.container}>
          <View style={styles.paymentContainer}>
            <View style={styles.zelleCard}>
              <View style={styles.zelleHeader}>
                <IconSymbol name="dollarsign.circle.fill" size={48} color={colors.secondary} />
                <Text style={styles.zelleTitle}>Pay with Zelle</Text>
              </View>

              <View style={styles.zelleInfo}>
                <Text style={styles.zelleLabel}>Name:</Text>
                <Text style={styles.zelleValue}>EZ Ports Farm</Text>
              </View>

              <View style={styles.zelleInfo}>
                <Text style={styles.zelleLabel}>Email:</Text>
                <Text style={styles.zelleValue}>EZportsfarm@gmail.com</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.orderTitle}>Your Order:</Text>
              {cart.map(item => (
                <View key={item.phoneNumber.id} style={styles.orderItem}>
                  <Text style={styles.orderItemText}>{item.phoneNumber.phoneNumber}</Text>
                  <Text style={styles.orderItemPrice}>${item.phoneNumber.price}</Text>
                </View>
              ))}

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${totalPrice}</Text>
              </View>
            </View>

            <View style={styles.warningBox}>
              <IconSymbol name="clock.fill" size={24} color={colors.highlight} />
              <Text style={styles.warningText}>
                You have 30 minutes to send payment. Your numbers are reserved during this time.
              </Text>
            </View>

            {paymentStep === 'pay' && (
              <Pressable style={styles.payButton} onPress={handlePay}>
                <Text style={styles.payButtonText}>I SENT THE PAYMENT</Text>
              </Pressable>
            )}

            {paymentStep === 'paid' && (
              <Pressable style={[styles.payButton, styles.paidButton]} onPress={handlePaid}>
                <Text style={styles.payButtonText}>CONFIRM PAYMENT SENT</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>

        <WarningModal
          visible={showWaitingModal}
          onClose={handleWaitingModalClose}
          type="waiting"
        />
        <WarningModal
          visible={showInboxModal}
          onClose={handleInboxModalClose}
          type="inbox"
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Shopping Cart',
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
        {cart.length > 0 ? (
          <>
            <FlatList
              data={cart}
              renderItem={renderCartItem}
              keyExtractor={item => item.phoneNumber.id}
              contentContainerStyle={[
                styles.listContainer,
                Platform.OS !== 'ios' && styles.listContainerWithTabBar
              ]}
              ListHeaderComponent={
                <View style={styles.cartHeader}>
                  <Text style={styles.cartTitle}>{cart.length} item(s) in cart</Text>
                  <Pressable onPress={clearCart}>
                    <Text style={styles.clearText}>Clear All</Text>
                  </Pressable>
                </View>
              }
            />

            <View style={styles.checkoutContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalAmount}>${totalPrice}</Text>
              </View>
              <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutButtonText}>Proceed to Payment</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <IconSymbol name="cart" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <Text style={styles.emptySubtext}>Add some numbers to get started!</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 180,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  clearText: {
    fontSize: 14,
    color: colors.highlight,
    fontWeight: '600',
  },
  cartItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkoutContainer: {
    backgroundColor: colors.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 0 : 80,
    left: 0,
    right: 0,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
  paymentContainer: {
    padding: 16,
  },
  zelleCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zelleHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  zelleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
  },
  zelleInfo: {
    marginBottom: 16,
  },
  zelleLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  zelleValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemText: {
    fontSize: 16,
    color: colors.text,
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  warningBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  payButton: {
    backgroundColor: colors.buttonBlue,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 100,
  },
  paidButton: {
    backgroundColor: colors.secondary,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
