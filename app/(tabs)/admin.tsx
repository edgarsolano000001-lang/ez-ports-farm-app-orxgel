
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, FlatList, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function AdminScreen() {
  const { addNewNumbers, availableNumbers, releaseToInbox } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [price, setPrice] = useState('');

  const handleAddNumber = () => {
    if (!phoneNumber || !accountNumber || !pin || !price) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newNumber = {
      phoneNumber,
      accountNumber,
      pin,
      price: parseFloat(price),
    };

    addNewNumbers([newNumber]);
    
    // Clear form
    setPhoneNumber('');
    setAccountNumber('');
    setPin('');
    setPrice('');

    Alert.alert('Success', 'Number added successfully!');
  };

  const handleReleaseNumber = (numberId: string) => {
    Alert.alert(
      'Release Number',
      'Are you sure you want to release this number to the customer\'s inbox?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Release',
          onPress: () => {
            releaseToInbox(numberId);
            Alert.alert('Success', 'Number released to inbox!');
          },
        },
      ]
    );
  };

  const reservedNumbers = availableNumbers.filter(n => n.status === 'reserved');

  const renderReservedNumber = ({ item }: { item: any }) => (
    <View style={styles.reservedCard}>
      <View style={styles.reservedHeader}>
        <View>
          <Text style={styles.reservedPhone}>{item.phoneNumber}</Text>
          <Text style={styles.reservedTime}>
            Reserved: {new Date(item.reservedAt).toLocaleString()}
          </Text>
        </View>
        <Text style={styles.reservedPrice}>${item.price}</Text>
      </View>

      <Pressable
        style={styles.releaseButton}
        onPress={() => handleReleaseNumber(item.id)}
      >
        <IconSymbol name="checkmark.circle.fill" size={20} color="#FFFFFF" />
        <Text style={styles.releaseButtonText}>Release to Inbox</Text>
      </Pressable>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Admin Panel',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <ScrollView style={commonStyles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Number</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="(555) 123-4567"
              placeholderTextColor={colors.textSecondary}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Account Number"
              placeholderTextColor={colors.textSecondary}
              value={accountNumber}
              onChangeText={setAccountNumber}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>PIN</Text>
            <TextInput
              style={styles.input}
              placeholder="PIN"
              placeholderTextColor={colors.textSecondary}
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="29.99"
              placeholderTextColor={colors.textSecondary}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>

          <Pressable style={styles.addButton} onPress={handleAddNumber}>
            <IconSymbol name="plus.circle.fill" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Number</Text>
          </Pressable>
        </View>

        <View style={[styles.section, { marginTop: 32 }]}>
          <Text style={styles.sectionTitle}>
            Reserved Numbers ({reservedNumbers.length})
          </Text>
          <Text style={styles.sectionSubtitle}>
            Waiting for payment validation
          </Text>

          {reservedNumbers.length > 0 ? (
            <FlatList
              data={reservedNumbers}
              renderItem={renderReservedNumber}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              style={styles.reservedList}
            />
          ) : (
            <View style={styles.emptyReserved}>
              <IconSymbol name="clock" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No reserved numbers</Text>
            </View>
          )}
        </View>

        <View style={{ height: Platform.OS === 'ios' ? 40 : 120 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#404040',
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reservedList: {
    marginTop: 8,
  },
  reservedCard: {
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
  reservedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reservedPhone: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  reservedTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  reservedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  releaseButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 6,
  },
  releaseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyReserved: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
});
