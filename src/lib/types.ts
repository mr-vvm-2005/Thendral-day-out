export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED';
export type PaymentMethod = 'UPI' | 'CASH' | 'BANK_TRANSFER';

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin';
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  total_bookings: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_id: string; // Format: TDO-YYMMDD-XXX
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  booking_date: string; // YYYY-MM-DD
  booking_type: string; // "Private Full-Day Booking"
  amount: number; // 3000
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_reference?: string;
  booking_status: BookingStatus;
  notes?: string;
  secure_token: string;
  created_at: string;
  updated_at: string;
}

export interface SettingData {
  business_name: string;
  parent_brand: string;
  tagline: string;
  phone: string;
  location: string;
  price: number;
  upi_id: string;
  check_in_time: string;
  check_out_time: string;
  cancellation_policy: string;
  rules_summary: string;
}
