import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY = Buffer.from(process.env.CRYPTO_TOKEN_SECRET!, "hex"); // 32-byte key

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Combine iv + encrypted data + authTag and encode in base64
  return Buffer.concat([iv, encrypted, authTag]).toString("base64");
}

export function decrypt(encryptedData: string): string {
  const data = Buffer.from(encryptedData, "base64");
  const iv = data.slice(0, IV_LENGTH);
  const authTag = data.slice(data.length - 16);
  const encrypted = data.slice(IV_LENGTH, data.length - 16);

  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
