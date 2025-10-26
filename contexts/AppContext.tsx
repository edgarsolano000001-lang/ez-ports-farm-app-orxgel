
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PhoneNumber, CartItem, PurchasedNumber } from '@/types/PhoneNumber';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType {
  availableNumbers: PhoneNumber[];
  cart: CartItem[];
  purchasedNumbers: PurchasedNumber[];
  addToCart: (number: PhoneNumber) => void;
  removeFromCart: (numberId: string) => void;
  clearCart: () => void;
  markAsPaid: (numbers: PhoneNumber[]) => void;
  releaseToInbox: (numberId: string) => void;
  addNewNumbers: (numbers: Omit<PhoneNumber, 'id' | 'status'>[]) => void;
  checkReservationTimeouts: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [availableNumbers, setAvailableNumbers] = useState<PhoneNumber[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [purchasedNumbers, setPurchasedNumbers] = useState<PurchasedNumber[]>([]);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    saveData();
  }, [availableNumbers, cart, purchasedNumbers]);

  // Check for reservation timeouts every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkReservationTimeouts();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [availableNumbers]);

  const loadData = async () => {
    try {
      const numbersData = await AsyncStorage.getItem('availableNumbers');
      const cartData = await AsyncStorage.getItem('cart');
      const purchasedData = await AsyncStorage.getItem('purchasedNumbers');

      if (numbersData) setAvailableNumbers(JSON.parse(numbersData));
      if (cartData) setCart(JSON.parse(cartData));
      if (purchasedData) setPurchasedNumbers(JSON.parse(purchasedData));
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('availableNumbers', JSON.stringify(availableNumbers));
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      await AsyncStorage.setItem('purchasedNumbers', JSON.stringify(purchasedNumbers));
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  const addToCart = (number: PhoneNumber) => {
    const cartItem: CartItem = {
      phoneNumber: number,
      addedAt: Date.now(),
    };
    setCart([...cart, cartItem]);
  };

  const removeFromCart = (numberId: string) => {
    setCart(cart.filter(item => item.phoneNumber.id !== numberId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const markAsPaid = (numbers: PhoneNumber[]) => {
    const now = Date.now();
    const reservationTimeout = 30 * 60 * 1000; // 30 minutes

    // Mark numbers as reserved
    setAvailableNumbers(prevNumbers =>
      prevNumbers.map(num => {
        const isPurchased = numbers.find(n => n.id === num.id);
        if (isPurchased) {
          return {
            ...num,
            status: 'reserved' as const,
            reservedAt: now,
          };
        }
        return num;
      })
    );

    // Remove from cart
    setCart(prevCart =>
      prevCart.filter(item => !numbers.find(n => n.id === item.phoneNumber.id))
    );
  };

  const releaseToInbox = (numberId: string) => {
    const number = availableNumbers.find(n => n.id === numberId);
    if (number && number.status === 'reserved') {
      // Add to purchased numbers
      const purchasedNumber: PurchasedNumber = {
        id: number.id,
        phoneNumber: number.phoneNumber,
        accountNumber: number.accountNumber,
        pin: number.pin,
        price: number.price,
        purchasedAt: number.reservedAt || Date.now(),
        releasedAt: Date.now(),
      };
      setPurchasedNumbers([...purchasedNumbers, purchasedNumber]);

      // Mark as sold
      setAvailableNumbers(prevNumbers =>
        prevNumbers.map(n =>
          n.id === numberId ? { ...n, status: 'sold' as const } : n
        )
      );
    }
  };

  const addNewNumbers = (numbers: Omit<PhoneNumber, 'id' | 'status'>[]) => {
    const newNumbers: PhoneNumber[] = numbers.map(num => ({
      ...num,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'available' as const,
    }));
    setAvailableNumbers([...availableNumbers, ...newNumbers]);
  };

  const checkReservationTimeouts = () => {
    const now = Date.now();
    const reservationTimeout = 30 * 60 * 1000; // 30 minutes

    setAvailableNumbers(prevNumbers =>
      prevNumbers.map(num => {
        if (num.status === 'reserved' && num.reservedAt) {
          const timeSinceReservation = now - num.reservedAt;
          if (timeSinceReservation > reservationTimeout) {
            console.log(`Releasing reserved number ${num.phoneNumber} back to available`);
            return {
              ...num,
              status: 'available' as const,
              reservedAt: undefined,
              reservedBy: undefined,
            };
          }
        }
        return num;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        availableNumbers,
        cart,
        purchasedNumbers,
        addToCart,
        removeFromCart,
        clearCart,
        markAsPaid,
        releaseToInbox,
        addNewNumbers,
        checkReservationTimeouts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
