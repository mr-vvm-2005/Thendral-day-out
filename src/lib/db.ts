import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Booking, Customer, SettingData, User } from './types';

const DB_PATH = path.resolve(process.cwd(), 'data', 'db.json');

interface DatabaseSchema {
  users: User[];
  customers: Customer[];
  bookings: Booking[];
  settings: SettingData;
}

// Password hashing with PBKDF2 (Secure cryptographic standard)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, originalHash] = combinedHash.split(':');
    if (!salt || !originalHash) return false;
    const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

const defaultSettings: SettingData = {
  business_name: 'THENDRAL DAY OUT',
  parent_brand: 'by THENDRAL GROUPS',
  tagline: 'Swim • Play • Celebrate • Make Memories',
  phone: '8778038383',
  location: 'Near Panpoli Thaika Bus Stop, Panpoli, Tenkasi, Tamil Nadu',
  price: 3000,
  upi_id: '8778038383@upi',
  check_in_time: '09:00 AM',
  check_out_time: '06:00 PM',
  cancellation_policy: 'Please contact the team directly at 8778038383 for any cancellation or rescheduling requests. Cancellations are handled subject to administrative review.',
  rules_summary: 'Venue is booked exclusively for full day. Outside prepared food permitted. Maintain pool safety and children supervision at all times.',
};

function initDb(): DatabaseSchema {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const adminPasswordHash = hashPassword('thendraldayout@tenkasi');
    const initialDb: DatabaseSchema = {
      users: [
        {
          id: 'user_admin_1',
          username: 'thendraldayouttenkasi@gmail.com',
          email: 'thendraldayouttenkasi@gmail.com',
          password_hash: adminPasswordHash,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      customers: [
        {
          id: 'cust_1',
          name: 'Karthik Subramanian',
          phone: '9840123456',
          total_bookings: 1,
          total_spent: 3000,
          created_at: '2026-10-15T10:00:00Z',
          updated_at: '2026-10-15T10:00:00Z',
        },
        {
          id: 'cust_2',
          name: 'Meena Ramesh',
          phone: '9791054321',
          total_bookings: 1,
          total_spent: 3000,
          created_at: '2026-10-18T14:30:00Z',
          updated_at: '2026-10-18T14:30:00Z',
        },
      ],
      bookings: [
        {
          id: 'b_1',
          booking_id: 'TDO-261105-001',
          customer_id: 'cust_1',
          customer_name: 'Karthik Subramanian',
          customer_phone: '9840123456',
          booking_date: '2026-11-05',
          booking_type: 'Private Full-Day Booking',
          amount: 3000,
          payment_status: 'PAID',
          payment_method: 'UPI',
          payment_reference: 'UPI/261105/9821',
          booking_status: 'CONFIRMED',
          notes: 'Family gathering with kids',
          secure_token: crypto.randomBytes(24).toString('hex'),
          created_at: '2026-10-15T10:00:00Z',
          updated_at: '2026-10-15T10:00:00Z',
        },
        {
          id: 'b_2',
          booking_id: 'TDO-261115-001',
          customer_id: 'cust_2',
          customer_name: 'Meena Ramesh',
          customer_phone: '9791054321',
          booking_date: '2026-11-15',
          booking_type: 'Private Full-Day Booking',
          amount: 3000,
          payment_status: 'PAID',
          payment_method: 'UPI',
          payment_reference: 'UPI/261115/4432',
          booking_status: 'CONFIRMED',
          notes: '7th Birthday celebration in party hall & pool',
          secure_token: crypto.randomBytes(24).toString('hex'),
          created_at: '2026-10-18T14:30:00Z',
          updated_at: '2026-10-18T14:30:00Z',
        },
      ],
      settings: defaultSettings,
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse database file, recovering:', err);
    return { users: [], customers: [], bookings: [], settings: defaultSettings };
  }
}

export function readDb(): DatabaseSchema {
  return initDb();
}

export function writeDb(data: DatabaseSchema): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_PATH);
}

// Generate Booking ID: TDO-[YYMMDD]-[SEQUENCE] safely on server
export function generateBookingId(dateStr: string, existingBookings: Booking[]): string {
  // dateStr is YYYY-MM-DD
  const parts = dateStr.split('-');
  const yymmdd = `${parts[0].slice(2)}${parts[1]}${parts[2]}`;
  const prefix = `TDO-${yymmdd}-`;

  const sameDayBookings = existingBookings.filter((b) => b.booking_id && b.booking_id.startsWith(prefix));
  const nextSeq = sameDayBookings.length + 1;
  const seqStr = String(nextSeq).padStart(3, '0');

  return `${prefix}${seqStr}`;
}

// Check race-condition: Ensure no other active CONFIRMED booking exists for that date
export function isDateAvailable(dateStr: string, excludeBookingId?: string): boolean {
  const db = readDb();
  return !db.bookings.some(
    (b) =>
      b.booking_date === dateStr &&
      b.booking_status === 'CONFIRMED' &&
      (!excludeBookingId || b.id !== excludeBookingId)
  );
}
