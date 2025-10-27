
import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface WarningModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'portout' | 'payment' | 'waiting' | 'inbox';
}

export default function WarningModal({ visible, onClose, type }: WarningModalProps) {
  const renderContent = () => {
    switch (type) {
      case 'portout':
        return (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={true}>
            <View style={styles.iconContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.highlight} />
            </View>
            
            <Text style={[styles.mainTitle, { color: colors.highlight }]}>IMPORTANT INFORMATION</Text>
            
            <Text style={styles.bodyText}>
              You&apos;re purchasing a Port-Out Number that can be ported exclusively to:
            </Text>
            
            <View style={styles.carrierList}>
              <Text style={styles.carrierItem}>- Metro By T-Mobile</Text>
              <Text style={styles.carrierItem}>- AT&amp;T</Text>
              <Text style={styles.carrierItem}>- Cricket</Text>
              <Text style={styles.carrierItem}>- Boost Mobile</Text>
              <Text style={styles.carrierItem}>- T-Mobile</Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.highlight }]}>Your Discount</Text>
              <Text style={styles.bodyText}>
                Get the biggest and most beautiful discount you could possibly get on your brand new phone when porting in with our vanity numbers!
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.teal }]}>Area Code Flexibility</Text>
                <IconSymbol name="exclamationmark.circle.fill" size={24} color={colors.teal} />
              </View>
              <Text style={styles.bodyText}>
                Don&apos;t worry if the area code isn&apos;t familiar or preferred. Simply request a number change to your desired area code after porting. Request the change to your new carrier.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.teal }]}>Scam Call Protection</Text>
              <Text style={styles.bodyText}>
                Keeping an out-of-state area code is actually beneficial—it helps you avoid local scam calls!
              </Text>
            </View>

            <View style={styles.spacer} />
            <View style={styles.spacer} />
            <View style={styles.spacer} />

            <View style={styles.buttonCutoffContainer}>
              <Pressable
                style={[styles.button, { backgroundColor: colors.buttonBlue }]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>I UNDERSTAND</Text>
              </Pressable>
            </View>
          </ScrollView>
        );

      case 'payment':
        return (
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <IconSymbol name="creditcard.fill" size={48} color={colors.highlight} />
            </View>
            
            <Text style={styles.mainTitle}>PAYMENT METHOD</Text>
            
            <Text style={styles.bodyText}>
              Payment methods are only through Zelle.
            </Text>

            <Pressable
              style={[styles.button, { backgroundColor: colors.buttonBlue, marginTop: 40 }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>I UNDERSTAND</Text>
            </Pressable>
          </View>
        );

      case 'waiting':
        return (
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <IconSymbol name="clock.fill" size={48} color={colors.secondary} />
            </View>
            
            <Text style={styles.mainTitle}>PAYMENT VALIDATION</Text>
            
            <Text style={styles.bodyText}>
              Please wait for payment validation. This usually takes 10-30 minutes while the payment is being processed.
            </Text>

            <Text style={[styles.bodyText, { marginTop: 16, fontWeight: '600' }]}>
              Your selected numbers are now reserved for 30 minutes.
            </Text>

            <Pressable
              style={[styles.button, { backgroundColor: colors.primary, marginTop: 40 }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>OK</Text>
            </Pressable>
          </View>
        );

      case 'inbox':
        return (
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <IconSymbol name="checkmark.circle.fill" size={48} color={colors.secondary} />
            </View>
            
            <Text style={styles.mainTitle}>PAYMENT SUBMITTED</Text>
            
            <Text style={styles.bodyText}>
              You will receive the port information in your inbox section once payment is validated.
            </Text>

            <Text style={[styles.bodyText, { marginTop: 16, fontWeight: '600' }]}>
              We recommend keeping notifications ON so you don&apos;t miss the notification.
            </Text>

            <Pressable
              style={[styles.button, { backgroundColor: colors.primary, marginTop: 40 }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>GOT IT</Text>
            </Pressable>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: colors.card,
    borderRadius: 16,
    maxWidth: 500,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollContent: {
    padding: 24,
  },
  content: {
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'center',
  },
  carrierList: {
    marginVertical: 16,
    paddingLeft: 20,
  },
  carrierItem: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 28,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
  buttonCutoffContainer: {
    height: 60,
    overflow: 'hidden',
    marginTop: 8,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
