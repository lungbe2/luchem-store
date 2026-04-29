import crypto from 'node:crypto';

export const payfastEncode = (value) => {
  return encodeURIComponent(String(value).trim()).replace(/%20/g, '+');
};

export const createPayFastSignature = (fields, passphrase = '') => {
  const signatureBase = Object.entries(fields)
    .filter(([key, value]) => key !== 'signature' && value !== undefined && value !== null && String(value).trim() !== '')
    .map(([key, value]) => `${key}=${payfastEncode(value)}`)
    .join('&');

  const signedBase = passphrase
    ? `${signatureBase}&passphrase=${payfastEncode(passphrase)}`
    : signatureBase;

  return crypto.createHash('md5').update(signedBase).digest('hex');
};

export const validatePayFastSignature = (fields, passphrase = '') => {
  if (!fields?.signature) return false;
  return createPayFastSignature(fields, passphrase) === fields.signature;
};
