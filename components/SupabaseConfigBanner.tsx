
import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';

interface SupabaseConfigBannerProps {
  onDismiss?: () => void;
}

export default function SupabaseConfigBanner({ onDismiss }: SupabaseConfigBannerProps) {
  const handleOpenDocs = () => {
    Linking.openURL('https://supabase.com/dashboard/project/rgayzlgixuxfmdplyoum/settings/api');
  };

  return (
    <View style={styles.banner}>
      <View style={styles.iconContainer}>
        <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.highlight} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Supabase Not Connected</Text>
        <Text style={styles.message}>
          Authentication is disabled. Update your .env file with Supabase credentials to enable cloud features.
        </Text>
        <Pressable style={styles.button} onPress={handleOpenDocs}>
          <Text style={styles.buttonText}>Get API Keys</Text>
          <IconSymbol name="arrow.up.right" size={14} color="#FFFFFF" />
        </Pressable>
      </View>
      {onDismiss && (
        <Pressable style={styles.dismissButton} onPress={onDismiss}>
          <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: colors.highlight,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});
