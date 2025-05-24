import * as argon2 from 'argon2';

export interface EncryptionOptions {
  type?: 0 | 1 | 2; // 0: argon2d, 1: argon2i, 2: argon2id
  memoryCost?: number; // in KiB
  timeCost?: number;   // number of iterations
  parallelism?: number; // degree of parallelism
}

export class EncryptionHelper {
  private static readonly DEFAULT_OPTIONS: EncryptionOptions = {
    type: 2, // argon2id
    memoryCost: 65536,    // 64 MiB
    timeCost: 3,          // 3 iterations
    parallelism: 4,       // 4 threads
  };

  /**
   * Encrypts data using Argon2
   * @param data - The data to encrypt
   * @param options - Optional encryption parameters
   * @returns The encrypted hash
   */
  static async encrypt(
    data: string,
    options: EncryptionOptions = {},
  ): Promise<string> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    return await argon2.hash(data, {
      type: config.type,
      memoryCost: config.memoryCost,
      timeCost: config.timeCost,
      parallelism: config.parallelism,
    });
  }

  /**
   * Verifies if the data matches the hash
   * @param data - The data to verify
   * @param hash - The hash to compare against
   * @returns True if the data matches the hash
   */
  static async verify(data: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, data);
  }

  /**
   * Encrypts data with high security settings
   * Use this for sensitive data that requires maximum security
   */
  static async encryptHighSecurity(data: string): Promise<string> {
    return this.encrypt(data, {
      memoryCost: 131072,  // 128 MiB
      timeCost: 4,         // 4 iterations
      parallelism: 4,      // 4 threads
    });
  }

  /**
   * Encrypts data with balanced security settings
   * Use this for standard security requirements
   */
  static async encryptBalanced(data: string): Promise<string> {
    return this.encrypt(data, this.DEFAULT_OPTIONS);
  }

  /**
   * Encrypts data with performance-focused settings
   * Use this for less sensitive data or when performance is critical
   */
  static async encryptPerformance(data: string): Promise<string> {
    return this.encrypt(data, {
      memoryCost: 32768,   // 32 MiB
      timeCost: 2,         // 2 iterations
      parallelism: 2,      // 2 threads
    });
  }
} 