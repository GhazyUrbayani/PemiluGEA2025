import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.VOTE_ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error(
      "VOTE_ENCRYPTION_KEY tidak diset di environment variables. " +
      "Silakan set environment variable ini dengan kunci yang kuat (minimal 32 karakter)."
    );
  }

  const salt = Buffer.from(process.env.VOTE_ENCRYPTION_SALT || "pemilu-gea-2025-salt");
  return crypto.pbkdf2Sync(key, salt, 100000, 32, "sha256");
}

export interface EncryptedBallot {
  encrypted: string;
  iv: string;
  authTag: string;
}

export interface BallotData {
  ketuaUmum: string[];
  senator: string[];
}

export function encryptBallot(ballotData: BallotData): EncryptedBallot {
  try {
    if (!ballotData.ketuaUmum || !ballotData.senator) {
      throw new Error("Data ballot tidak valid: ketuaUmum dan senator wajib diisi");
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    
    const key = getEncryptionKey();
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const ballotString = JSON.stringify(ballotData);
    
    let encrypted = cipher.update(ballotString, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
    };
  } catch (error) {
    console.error("Error saat mengenkripsi ballot:", error);
    throw new Error("Gagal mengenkripsi data ballot");
  }
}

export function decryptBallot(encryptedBallot: EncryptedBallot): BallotData {
  try {
    if (!encryptedBallot.encrypted || !encryptedBallot.iv || !encryptedBallot.authTag) {
      throw new Error("Data terenkripsi tidak valid");
    }

    const iv = Buffer.from(encryptedBallot.iv, "hex");
    const authTag = Buffer.from(encryptedBallot.authTag, "hex");
    
    const key = getEncryptionKey();
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedBallot.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    const ballotData = JSON.parse(decrypted) as BallotData;
    
    if (!ballotData.ketuaUmum || !ballotData.senator) {
      throw new Error("Struktur data ballot tidak valid setelah dekripsi");
    }
    
    return ballotData;
  } catch (error) {
    console.error("Error saat mendekripsi ballot:", error);
    throw new Error("Gagal mendekripsi data ballot. Data mungkin corrupt atau kunci salah.");
  }
}

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function verifyToken(token: string, hash: string): boolean {
  const tokenHash = hashToken(token);
  return crypto.timingSafeEqual(
    Buffer.from(tokenHash, "hex"),
    Buffer.from(hash, "hex")
  );
}
