
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { useApp } from '@/contexts/AppContext';

export default function ProfileScreen() {
  const { user, signIn, signUp, signOut, isConfigured } = useAuth();
  const { purchasedNumbers } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    const { error } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setEmail('');
      setPassword('');
      if (isSignUp) {
        Alert.alert('Success', 'Account created! Please check your email to verify.');
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    Alert.alert('Success', 'Signed out successfully');
  };

  if (!isConfigured) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Profile',
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
          <View style={styles.notConfiguredContainer}>
            <IconSymbol name="exclamationmark.triangle.fill" size={64} color={colors.highlight} />
            <Text style={styles.notConfiguredTitle}>Supabase Not Connected</Text>
            <Text style={styles.notConfiguredText}>
              To enable user authentication and order history, please connect Supabase:
            </Text>
            <View style={styles.instructionsList}>
              <Text style={styles.instructionItem}>1. Press the Supabase button in the toolbar</Text>
              <Text style={styles.instructionItem}>2. Connect to your Supabase project</Text>
              <Text style={styles.instructionItem}>3. Create a project if you don&apos;t have one</Text>
            </View>
            <Text style={styles.notConfiguredSubtext}>
              For now, you can still use the app without authentication. Your data is stored locally.
            </Text>
          </View>
        </View>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Stack.Screen
          options={{
            title: isSignUp ? 'Sign Up' : 'Sign In',
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
          <View style={styles.authContainer}>
            <View style={styles.iconContainer}>
              <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
            </View>

            <Text style={styles.authTitle}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.authSubtitle}>
              {isSignUp 
                ? 'Sign up to track your orders and history'
                : 'Sign in to view your order history'}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Pressable 
              style={[styles.authButton, loading && styles.authButtonDisabled]} 
              onPress={handleAuth}
              disabled={loading}
            >
              <Text style={styles.authButtonText}>
                {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </Text>
            </Pressable>

            <Pressable 
              style={styles.switchButton}
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text style={styles.switchButtonText}>
                {isSignUp 
                  ? 'Already have an account? Sign In'
                  : 'Don\'t have an account? Sign Up'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </>
    );
  }

  // User is logged in
  const userOrders = purchasedNumbers.filter(n => n.releasedAt);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
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
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userOrders.length}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                ${userOrders.reduce((sum, order) => sum + order.price, 0).toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order History</Text>
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <IconSymbol name="phone.fill" size={20} color={colors.teal} />
                    <Text style={styles.orderPhone}>{order.phoneNumber}</Text>
                  </View>
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderDate}>
                      {new Date(order.releasedAt || order.purchasedAt).toLocaleDateString()}
                    </Text>
                    <Text style={styles.orderPrice}>${order.price}</Text>
                  </View>
                  <View style={styles.orderStatus}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color={colors.secondary} />
                    <Text style={styles.orderStatusText}>Completed</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyOrders}>
                <IconSymbol name="tray" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No orders yet</Text>
              </View>
            )}
          </View>

          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <IconSymbol name="arrow.right.square.fill" size={20} color="#FFFFFF" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>

          <View style={{ height: Platform.OS === 'ios' ? 40 : 120 }} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  notConfiguredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  notConfiguredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  notConfiguredText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  instructionsList: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    width: '100%',
  },
  instructionItem: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 24,
  },
  notConfiguredSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  authContainer: {
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
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
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#404040',
  },
  authButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  profileContainer: {
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileEmail: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    flexDirection: 'row',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#404040',
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  orderPhone: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderStatusText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
  },
  emptyOrders: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  signOutButton: {
    backgroundColor: colors.highlight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
