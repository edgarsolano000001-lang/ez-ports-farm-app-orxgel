
export interface PhoneNumber {
  id: string;
  phoneNumber: string;
  accountNumber: string;
  pin: string;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  reservedBy?: string;
  reservedAt?: number;
  purchasedBy?: string;
  purchasedAt?: number;
}

export interface CartItem {
  phoneNumber: PhoneNumber;
  addedAt: number;
}

export interface PurchasedNumber {
  id: string;
  phoneNumber: string;
  accountNumber: string;
  pin: string;
  price: number;
  purchasedAt: number;
  releasedAt?: number;
}
