import bcrypt from "bcryptjs";

/**
 * Turns a plaintext password into a secure hash.
 * Uses bcrypt with 10 rounds — secure and fast.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Checks if a plaintext password matches a stored hash.
 * Returns true if they match, false otherwise.
 */
export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}