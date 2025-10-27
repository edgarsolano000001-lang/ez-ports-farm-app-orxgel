
import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function InboxScreen() {
  const { purchasedNumbers } = useApp();

  const releasedNumbers = purchasedNumbers.filter(n => n.releasedAt);

  const renderInboxItem = ({ item }: { item: any }) => (
    <View style={styles.inboxCard}>
      <View style={styles.cardHeader}>
        <IconSymbol name="checkmark.circle.fill" size={24} color={colors.secondary} />
        <Text style={styles.releasedText}>Released</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.value}>{item.phoneNumber}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Account Number:</Text>
        <Text style={styles.valueSecret}>{item.accountNumber}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>PIN:</Text>
        <Text style={styles.valueSecret}>{item.pin}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Released: {new Date(item.releasedAt).toLocaleString()}
        </Text>
        <Text style={styles.priceText}>${item.price}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Inbox',
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
        {releasedNumbers.length > 0 ? (
          <FlatList
            data={releasedNumbers}
            renderItem={renderInboxItem}
            keyExtractor={item => item.id}
            contentContainerStyle={[
              styles.listContainer,
              Platform.OS !== 'ios' && styles.listContainerWithTabBar
            ]}
            ListHeaderComponent={
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Port Numbers</Text>
                <Text style={styles.headerSubtitle}>
                  {releasedNumbers.length} number(s) ready
                </Text>
              </View>
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <IconSymbol name="tray" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No numbers yet</Text>
            <Text style={styles.emptySubtext}>
              Your purchased numbers will appear here after payment validation
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
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
  inboxCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  releasedText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  valueSecret: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#404040',
    marginVertical: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
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
    textAlign: 'center',
  },
});
