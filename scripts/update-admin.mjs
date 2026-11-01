import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return salt + ':' + hash;
}

const newPassword = 'thendraldayout@tenkasi';
const newEmail = 'thendraldayouttenkasi@gmail.com';
const newHash = hashPassword(newPassword);

const dbPath = path.resolve('data/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.users = [
  {
    id: 'user_admin_1',
    username: newEmail,
    email: newEmail,
    password_hash: newHash,
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated data/db.json with new credentials:');
console.log('Email / Username:', newEmail);
console.log('Password hash generated successfully.');

