import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

function getKey(): Buffer | null {
  const key = process.env.APP_ENCRYPTION_KEY;
  if (!key) return null;
  return crypto.scryptSync(key, "salt", 32);
}

export function encrypt(text: string): string {
  const key = getKey();
  if (!key) return "";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(encrypted: string): string {
  const key = getKey();
  if (!key) return "";
  const parts = encrypted.split(":");
  if (parts.length !== 2) return "";
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = Buffer.from(parts[1], "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString("utf8");
}
