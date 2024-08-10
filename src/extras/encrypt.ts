import crypto from 'crypto';

// Ensure ENCRYPTION_KEY is a 32-byte hex string for AES-256
const NEXT_PUBLIC_ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!;
const IV_LENGTH = 16; // AES IV length

// Encoding function
export const encodeData = (data: { Publickey: string, Adress: string }): string => {
    if (!data.Publickey || !data.Adress) {
        throw new Error("Invalid input: Publickey or Adress is missing");
    }

    if (!NEXT_PUBLIC_ENCRYPTION_KEY) {
        throw new Error("ENCRYPTION_KEY is not defined");
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const keyBuffer = Buffer.from(NEXT_PUBLIC_ENCRYPTION_KEY, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    const plaintext = JSON.stringify(data);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

// Decoding function
export const decodeData = async (encodedString: string): Promise<{ Publickey: string, Adress: string }> => {
    try {
        const [ivHex, encryptedHex] = encodedString.split(':');
        if (!ivHex || !encryptedHex) {
            throw new Error('Invalid token format');
        }
        const iv = Buffer.from(ivHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(NEXT_PUBLIC_ENCRYPTION_KEY, 'hex'), iv);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return JSON.parse(decrypted.toString('utf8'));
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Decryption failed: ${error.message}`);
        } else {
            throw new Error('Decryption failed: An unknown error occurred');
        }
    }
};
