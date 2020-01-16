import crypto from 'crypto';

const CRYPTO_CONFIG = Object.freeze({
  ALGORITHM: 'aes-256-ctr',
  KEY: crypto.randomBytes(32),
  IV: crypto.randomBytes(16),
});

export const encrypt = (x: string) => {
  const cipher = crypto.createCipheriv(
    CRYPTO_CONFIG.ALGORITHM,
    Buffer.from(CRYPTO_CONFIG.KEY),
    CRYPTO_CONFIG.IV,
  );
  let encrypted = cipher.update(x);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    iv: CRYPTO_CONFIG.IV.toString('hex'),
    key: CRYPTO_CONFIG.KEY.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
};

export const decrypt = (x: { iv: string; key: string; encryptedData: string }) => {
  const iv = Buffer.from(x.iv, 'hex');
  const key = Buffer.from(x.key, 'hex');
  const encryptedText = Buffer.from(x.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(CRYPTO_CONFIG.ALGORITHM, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
