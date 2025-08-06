import crypto from 'crypto';

/**
 * AES-256-GCM encryption utilities for sensitive data at rest
 * Implements authenticated encryption with associated data (AEAD)
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const ITERATIONS = 100000;

/**
 * Derive an encryption key from a password using PBKDF2
 */
export function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
}

/**
 * Generate a random salt for key derivation
 */
export function generateSalt(): Buffer {
  return crypto.randomBytes(SALT_LENGTH);
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * @param text - Plain text to encrypt
 * @param key - Encryption key (32 bytes hex string)
 * @returns Encrypted string in format: iv:authTag:encrypted:salt
 */
export function encrypt(text: string, key?: string): string {
  const encryptionKey = key || process.env.ENCRYPTION_KEY;
  
  if (!encryptionKey) {
    throw new Error('Encryption key not configured. Set ENCRYPTION_KEY environment variable.');
  }

  // Validate key format
  if (encryptionKey.length !== 64) {
    throw new Error('Encryption key must be 32 bytes (64 hex characters)');
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = generateSalt();
  const derivedKey = deriveKey(encryptionKey, salt);
  
  const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);
  
  const authTag = cipher.getAuthTag();
  
  // Combine all components
  return [
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted.toString('hex'),
    salt.toString('hex')
  ].join(':');
}

/**
 * Decrypt data encrypted with encrypt()
 * @param encryptedText - Encrypted string from encrypt()
 * @param key - Decryption key (32 bytes hex string)
 * @returns Decrypted plain text
 */
export function decrypt(encryptedText: string, key?: string): string {
  const decryptionKey = key || process.env.ENCRYPTION_KEY;
  
  if (!decryptionKey) {
    throw new Error('Decryption key not configured. Set ENCRYPTION_KEY environment variable.');
  }

  const parts = encryptedText.split(':');
  
  if (parts.length !== 4) {
    throw new Error('Invalid encrypted data format');
  }
  
  const [ivHex, authTagHex, encryptedHex, saltHex] = parts;
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const salt = Buffer.from(saltHex, 'hex');
  
  const derivedKey = deriveKey(decryptionKey, salt);
  const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);
  decipher.setAuthTag(authTag);
  
  try {
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    throw new Error('Failed to decrypt data. Invalid key or corrupted data.');
  }
}

/**
 * Hash sensitive data for comparison (e.g., API keys)
 * Uses HMAC-SHA256 for secure hashing
 */
export function hashData(data: string, salt?: string): string {
  const hashSalt = salt || process.env.HASH_SALT || 'default-salt';
  return crypto
    .createHmac('sha256', hashSalt)
    .update(data)
    .digest('hex');
}

/**
 * Generate a secure random token
 * @param length - Token length in bytes (default 32)
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Encrypt PII data with field-level encryption
 */
export interface EncryptedPII {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

export function encryptPII(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}): EncryptedPII {
  return {
    name: encrypt(data.name),
    email: encrypt(data.email.toLowerCase()),
    phone: data.phone ? encrypt(data.phone) : undefined,
    company: data.company ? encrypt(data.company) : undefined,
    message: data.message ? encrypt(data.message) : undefined,
  };
}

/**
 * Decrypt PII data
 */
export function decryptPII(encryptedData: EncryptedPII): {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
} {
  return {
    name: decrypt(encryptedData.name),
    email: decrypt(encryptedData.email),
    phone: encryptedData.phone ? decrypt(encryptedData.phone) : undefined,
    company: encryptedData.company ? decrypt(encryptedData.company) : undefined,
    message: encryptedData.message ? decrypt(encryptedData.message) : undefined,
  };
}

/**
 * Validate encryption key format
 */
export function validateEncryptionKey(key: string): boolean {
  // Must be 32 bytes (64 hex characters)
  return /^[a-f0-9]{64}$/i.test(key);
}

/**
 * Generate a new encryption key for initial setup
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Export utility to help with initial setup
export function setupEncryption(): void {
  if (!process.env.ENCRYPTION_KEY) {
    console.log('⚠️  ENCRYPTION_KEY not set in environment variables');
    console.log('Generate a new key with the following command:');
    console.log('node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    console.log('\nThen add it to your .env.local file:');
    console.log('ENCRYPTION_KEY=your_generated_key_here');
  } else if (!validateEncryptionKey(process.env.ENCRYPTION_KEY)) {
    console.error('❌ Invalid ENCRYPTION_KEY format. Must be 64 hex characters.');
  } else {
    console.log('✅ Encryption properly configured');
  }
}