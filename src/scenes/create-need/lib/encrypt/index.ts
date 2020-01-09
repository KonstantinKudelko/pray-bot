import crypto from 'crypto';

const CRYPTO_CONFIG = Object.freeze({
  ALGORITHM: 'aes-256-ctr',
  PASSWORD: 'praybot',
});

export const encrypt = (x: string) => {
  const cipher = crypto.createCipher(CRYPTO_CONFIG.ALGORITHM, CRYPTO_CONFIG.PASSWORD);
  let crypted = cipher.update(x, 'utf8', 'hex');
  crypted += cipher.final('hex');

  return crypted;
};

export const decrypt = (x: string) => {
  const decipher = crypto.createDecipher(CRYPTO_CONFIG.ALGORITHM, CRYPTO_CONFIG.PASSWORD);
  let dec = decipher.update(x, 'hex', 'utf8');
  dec += decipher.final('utf8');

  return dec;
};
